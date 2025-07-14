import { AbstractRepository } from '../../database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from './users.schema';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  constructor(
    @InjectModel(User.name) _model: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    const logger = new PinoLogger({});
    super(_model, connection, logger);
  }
}
