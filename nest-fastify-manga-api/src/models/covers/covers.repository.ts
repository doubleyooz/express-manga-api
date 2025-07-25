import { AbstractRepository } from '../../database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Cover } from './covers.schema';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CoversRepository extends AbstractRepository<Cover> {
  constructor(
    @InjectModel(Cover.name) _model: Model<Cover>,
    @InjectConnection() connection: Connection,
  ) {
    const logger = new PinoLogger({});
    super(_model, connection, logger);
  }
}
