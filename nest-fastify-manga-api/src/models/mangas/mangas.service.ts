import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery } from 'mongoose';

import { MangaDocument } from './mangas.schema';
import { CreateMangaRequest } from './dto/create-manga.request';
import { MangasRepository } from './mangas.repository';

@Injectable()
export class MangasService {
  constructor(
    private readonly _repository: MangasRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(data: CreateMangaRequest) {
    console.log(data);
    try {
      const newManga = await this._repository.create({
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

    const result = await this._repository.find(queryOptions);

    if (result.length === 0) {
      throw new NotFoundException('Manga not Found');
    }

    return result;
  }

    async findById(filter: FilterQuery<MangaDocument>): Promise<Manga> {
      const id = filter._id;
  
      const document = await this._repository.findOne(id);
      if (!document) {
        this.logger.error(`No user with user id ${id} was found.`, null);
        throw new NotFoundException('User not found.');
      }
      return document;
    }
  
}
