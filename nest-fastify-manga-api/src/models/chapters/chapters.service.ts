import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { FilterQuery, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { ChaptersRepository } from './chapters.repository';
import { Chapter, ChapterDocument } from './chapters.schema';

import { CreateChapterRequest } from './dto/create-chapter.request';
import { FindChaptersRequest } from './dto/find-chapters.request';
import { UpdateChapterRequest } from './dto/update-chapter.request';

import { MangasRepository } from '../mangas/mangas.repository';
import { LocalStorageService } from '../../common/storage/local-storage.service';

@Injectable()
export class ChaptersService {
  constructor(
    private readonly _repository: ChaptersRepository,
    private readonly _mangaRepository: MangasRepository,
    private readonly storageService: LocalStorageService,
    private readonly configService: ConfigService,
  ) {}

  async create(data: CreateChapterRequest) {
    console.log(data);
    try {
      const newDocument = await this._repository.create({
        ...data,
      });

      return newDocument;
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException({
        code: err.code,
        msg: 'Error while creating chapter',
      });
    }
  }

  async find(filter: FindChaptersRequest) {
    const result = await this._repository.find(filter);
    return result;
  }

  async findById(filter: FilterQuery<ChapterDocument>): Promise<Chapter> {
    const id = filter._id;

    const document = await this._repository.findOne(id);
    if (!document) {
      throw new NotFoundException('Chapter not found.');
    }
    return document;
  }

  async update(id: Types.ObjectId, data: UpdateChapterRequest): Promise<Chapter> {
    try {
      const updatedDoc = await this._repository.findOneAndUpdate(
        { _id: id },
        { $set: { ...data } },
        { new: true }, // Return the updated document
      );

      if (!updatedDoc) {
        throw new NotFoundException('Chapter not found');
      }

      return updatedDoc;
    } catch (err) {
      console.error('Error updating cover:', err);
      
      throw new InternalServerErrorException({
        code: err.code,
        msg: 'Error while updating cover',
      });
    }
  }

  async deleteById(chapterId: Types.ObjectId, throwNotFound = true) {
    const session = await this._repository.startTransaction();
    try {
      // 1. Find the chapter in question
      const chapter = await this._repository.findOneAndDelete({_id: chapterId});
  
      if (chapter === null && throwNotFound) {
        throw new NotFoundException();
      }

      // 2. Remove chapter from the manga
      const manga = await this._mangaRepository.findOneAndUpdate(
        { _id: chapter.mangaId },
        { $pull: { chapters: chapterId } },
        { session },
      )  
      
      // 3. Collect all image files to delete
      const allImages = chapter.files;

      console.log('Total images to delete:', allImages.length);

      // 4. Commit transaction first
      await this._repository.commitTransaction(session);

      // 5. Delete files AFTER successful DB operations
      if (allImages.length > 0) {
        try {
          await this.storageService.deleteFiles(allImages);
        } catch (fileError) {
          console.error('File deletion failed:', fileError);
          // Log but don't throw - DB is already consistent
        }
      }

      return { deleted: chapter, deletedFiles: allImages.length };
    } catch (error) {
      console.error('Error:', error);
      await this._repository.abortTransaction(session);
      throw error;
    } finally {
      await this._repository.endSession(session);
    }
  }


}
