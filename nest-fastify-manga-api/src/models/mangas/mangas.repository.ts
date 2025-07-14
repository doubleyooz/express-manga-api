import { AbstractRepository } from '../../database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Manga } from './mangas.schema';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MangasRepository extends AbstractRepository<Manga> {
  constructor(
    @InjectModel(Manga.name) _model: Model<Manga>,
    @InjectConnection() connection: Connection,
  ) {
    const logger = new PinoLogger({});
    super(_model, connection, logger);
  }
}
