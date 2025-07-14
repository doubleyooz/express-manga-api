import { AbstractRepository } from '../../database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Chapter } from './chapters.schema';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ChaptersRepository extends AbstractRepository<Chapter> {
  constructor(
    @InjectModel(Chapter.name) _model: Model<Chapter>,
    @InjectConnection() connection: Connection,
  ) {
    const logger = new PinoLogger({});
    super(_model, connection, logger);
  }
}
