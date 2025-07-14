import { AbstractRepository } from '../../database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Review } from './reviews.schema';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ReviewsRepository extends AbstractRepository<Review> {
  constructor(
    @InjectModel(Review.name) _model: Model<Review>,
    @InjectConnection() connection: Connection,
  ) {
    const logger = new PinoLogger({});
    super(_model, connection, logger);
  }
}
