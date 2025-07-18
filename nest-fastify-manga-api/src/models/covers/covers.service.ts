import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { FilterQuery, Types } from 'mongoose';
import { CreateCoverRequest } from './dto/create-cover.request';
import { ConfigService } from '@nestjs/config';
import { CoversRepository } from './covers.repository';
import { FindCoversRequest } from './dto/find-covers.request';
import { UpdateCoverRequest} from './dto/update-cover.request';
import { CoverDocument, Cover } from './covers.schema';
import { MangasRepository } from '../mangas/mangas.repository';
import { LocalStorageService } from '../../common/storage/local-storage.service';

@Injectable()
export class CoversService {
  constructor(
    private readonly _repository: CoversRepository,
    private readonly mangaRepository: MangasRepository,
    private readonly storageService: LocalStorageService,
    private readonly configService: ConfigService,
  ) {}

  async create(data: CreateCoverRequest) {
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
        msg: 'Error while creating cover',
      });
    }
  }

  async find(filter: FindCoversRequest) {
    const result = await this._repository.find(filter);
    return result;
  }


  async findById(filter: FilterQuery<CoverDocument>): Promise<Cover> {
    const id = filter._id;

    const document = await this._repository.findOne(id);
    if (!document) {
      throw new NotFoundException('Cover not found.');
    }
    return document;
  }

  async update(id: Types.ObjectId, data: UpdateCoverRequest): Promise<Cover> {
    try {
      const updatedDoc = await this._repository.findOneAndUpdate(
        { _id: id },
        { $set: { ...data } },
        { new: true }, // Return the updated document
      );

      if (!updatedDoc) {
        throw new NotFoundException('Cover not found');
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

  async deleteById(coverId: Types.ObjectId, throwNotFound = true) {
    const session = await this._repository.startTransaction();
    try {
      // 1. Find the cover in question
      const cover = await this._repository.findOneAndDelete({_id: coverId});
  
      if (cover === null && throwNotFound) {
        throw new NotFoundException();
      }

      // 2. Remove cover from the manga
      const manga = await this.mangaRepository.findOneAndUpdate(
        { _id: cover.mangaId },
        { $pull: { covers: coverId } },
        { session },
      )  
      
      // 3. Collect all image files to delete
      const allImages = cover.files;

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

      return { deleted: cover, deletedFiles: allImages.length };
    } catch (error) {
      console.error('Error:', error);
      await this._repository.abortTransaction(session);
      throw error;
    } finally {
      await this._repository.endSession(session);
    }
  }
}
