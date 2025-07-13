import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { CreateCoverRequest } from './dto/create-cover.request';
import { ConfigService } from '@nestjs/config';
import { CoversRepository } from './covers.repository';
import { FindCoversRequest } from './dto/find-covers.request';

@Injectable()
export class CoversService {
  constructor(
    private readonly _repository: CoversRepository,
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
}
