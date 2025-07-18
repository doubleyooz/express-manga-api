import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, Types } from 'mongoose';

import { Manga, MangaDocument } from './mangas.schema';
import { CreateMangaRequest } from './dto/create-manga.request';
import { MangasRepository } from './mangas.repository';
import { ChaptersRepository } from '../chapters/chapters.repository';
import { ReviewsRepository } from '../reviews/reviews.repository';
import { CoversRepository } from '../covers/covers.repository';
import { UsersRepository } from '../users/users.repository';
import { UpdateMangaRequest } from './dto/update-manga.request';
import { LocalStorageService } from '../../common/storage/local-storage.service';

@Injectable()
export class MangasService {
  constructor(
    private readonly mangaRepository: MangasRepository,
    private readonly chapterRepository: ChaptersRepository,
    private readonly coversRepository: CoversRepository,
    private readonly reviewRepository: ReviewsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly storageService: LocalStorageService
  ) {}

  async create(data: CreateMangaRequest) {
    console.log(data);
    try {
      const newManga = await this.mangaRepository.create({
        ...data,
      });
      console.log(newManga);
      return newManga;
    } catch (err) {
      console.log(err);
      if (err.code === 11000) {
        throw new UnprocessableEntityException('Title already taken');
      }
      throw new InternalServerErrorException({
        code: err.code,
        msg: 'Error while creating manga',
      });
    }
  }

  async find(filter: FilterQuery<MangaDocument>) {
    const queryOptions = { where: undefined };
    console.log({ filter });
    // Check if filter is empty
    if (Object.keys(filter).length > 0 && filter.constructor === Object) {
      queryOptions.where = { ...filter };
    }

    const result = await this.mangaRepository.find(queryOptions);

    if (result.length === 0) {
      throw new NotFoundException('Manga not found');
    }

    return result;
  }

  async findById(filter: FilterQuery<MangaDocument>): Promise<Manga> {
    const id = filter._id;

    const document = await this.mangaRepository.findOne(id);
    if (!document) {
      throw new NotFoundException('Manga not found.');
    }
    return document;
  }

  async update(id: Types.ObjectId, data: UpdateMangaRequest): Promise<Manga> {
    try {
      const updatedManga = await this.mangaRepository.findOneAndUpdate(
        { _id: id },
        { $set: { ...data } },
        { new: true }, // Return the updated document
      );

      if (!updatedManga) {
        throw new NotFoundException('Manga not found');
      }

      return updatedManga;
    } catch (err) {
      console.error('Error updating manga:', err);
      if (err.code === 11000) {
        throw new UnprocessableEntityException('Title already taken');
      }
      throw new InternalServerErrorException({
        code: err.code,
        msg: 'Error while updating manga',
      });
    }
  }

  async deleteById(mangaId, throwNotFound = true) {
    const session = await this.mangaRepository.startTransaction();
    try {
      // 1. Find all chapters with their images
      const chapters = await this.chapterRepository.find({ mangaId });
      console.log('Chapters found:', chapters.length);

      // 2. Find all covers with their images
      const covers = await this.coversRepository.find({ mangaId });
      console.log('Covers found:', covers.length);

      // 3. Delete all reviews
      const reviewsCount = await this.reviewRepository.deleteMany(
        { mangaId },
        { session },
      );

      console.log('Reviews found:', reviewsCount);

      // 4. Delete chapters from database
      const deletedChapters = await this.chapterRepository.deleteMany(
        { mangaId },
        { session },
      );

      console.log('Chapters deleted:', deletedChapters.deletedCount);

      // 5. Delete covers from database
      const deletedCovers = await this.coversRepository.deleteMany(
        { mangaId },
        { session },
      );

      console.log('Covers deleted:', deletedCovers);

      // 6. Delete manga from database
      const document = await this.mangaRepository.findOneAndDelete(
        {
          _id: mangaId,
        },
        { session },
      );

      if (document === null && throwNotFound) {
        throw new NotFoundException();
      }
      console.log('Manga deleted:', document ? document.title : 'Not found');

      // 7. Delete manga from user list
      const mangaOwner = await this.usersRepository.findOneAndUpdate(
        { _id: document.userId },
        { $pull: { mangas: mangaId } },
        { session },
      );

      if (!mangaOwner) {
        throw new UnprocessableEntityException();
      }

      // 8. Collect all image files to delete
      const allImages = chapters
        .flatMap((chapter) => chapter.files)
        .concat(covers.flatMap((cover) => cover.files));

      console.log('Total images to delete:', allImages.length);

      // 9. Commit transaction first
      await this.mangaRepository.commitTransaction(session);

      // 10. Delete files AFTER successful DB operations
      if (allImages.length > 0) {
        try {
          await this.storageService.deleteFiles(allImages);
        } catch (fileError) {
          console.error('File deletion failed:', fileError);
          // Log but don't throw - DB is already consistent
        }
      }

      return { deletedManga: document, deletedChapters: chapters.length };
    } catch (error) {
      console.error('Error:', error);
      await this.mangaRepository.abortTransaction(session);
      throw error;
    } finally {
      await this.mangaRepository.endSession(session);
    }
  }
}
