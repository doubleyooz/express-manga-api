import { AbstractRepository } from '../../database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Cover } from './covers.schema';

@Injectable()
export class CoversRepository extends AbstractRepository<Cover> {
  constructor(
    @InjectModel(Cover.name) coverModel: Model<Cover>,
    @InjectConnection() connection: Connection,
  ) {
    super(coverModel, connection);
    this.logger.setContext(CoversRepository.name);
  }
}
