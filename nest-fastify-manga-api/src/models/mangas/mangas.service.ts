import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, Model } from 'mongoose';

import { Manga, MangaDocument } from './mangas.schema';
import { CreateMangaRequest } from './dto/create-manga.request';

@Injectable()
export class MangasService {
  constructor(
    @InjectModel(Manga.name) private mangaModel: Model<Manga>,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(MangasService.name);

  async createManga(data: CreateMangaRequest) {
    console.log(data);
    try {
      const newUser = await this.mangaModel.create({
        ...data,
      });
      console.log(newUser);
      return newUser;
    } catch (err) {
      console.log(err);
      if (err.code == '11000') {
        throw new UnprocessableEntityException('Title already taken');
      }
      throw new InternalServerErrorException({
        code: err.code,
        msg: 'Error while creating manga',
      });
    }
  }

  async findAll(filter: FilterQuery<MangaDocument>) {
    const queryOptions = { where: undefined };
    console.log({ filter });
    // Check if filter is empty
    if (Object.keys(filter).length > 0 && filter.constructor === Object) {
      queryOptions.where = { ...filter };
    }

    const result = await this.mangaModel.find(queryOptions);

    if (result.length === 0) {
      throw new NotFoundException('Manga not Found');
    }

    return result;
  }
}
