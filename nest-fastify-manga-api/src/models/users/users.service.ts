import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { CreateUserRequest } from './dto/create-user.request';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './users.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly _repository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async create(data: CreateUserRequest) {
    console.log(data);
    try {
      const newDocument = await this._repository.create({
        ...data,
        password: await bcrypt.hash(
          data.password,
          this.configService.get<number>('HASH_SALT'),
        ),
      });
      console.log(newDocument);
      return newDocument;
    } catch (err) {
      console.log(err);
      if (err.code === 11000) {
        throw new UnprocessableEntityException('Email already taken');
      }
      throw new InternalServerErrorException({
        code: err.code,
        msg: 'Error while creating user',
      });
    }
  }

  async getUser(filter: FilterQuery<UserDocument>) {
    return await this._repository.findOne({
      ...filter,
    });
  }

  async findAll(filter: FilterQuery<UserDocument>) {
    const queryOptions = { where: undefined };
    console.log({ filter });
    // Check if filter is empty
    if (Object.keys(filter).length > 0 && filter.constructor === Object) {
      queryOptions.where = { ...filter };
    }

    const result = await this._repository.find(queryOptions);

    if (result.length === 0) {
      throw new NotFoundException('User not Found');
    }

    return result;
  }

  async findById(filter: FilterQuery<UserDocument>): Promise<User> {
    const id = filter._id;

    const document = await this._repository.findOne(id);
    if (!document) {
      this.logger.error(`No user with user id ${id} was found.`, null);
      throw new NotFoundException('User not found.');
    }
    return document;
  }

  async updateTokenVersion(id: string): Promise<User> {
    const document = await this._repository.findOneAndUpdate(
      { _id: id },
      { $inc: { tokenVersion: 1 } },
    );
    if (!document) {
      this.logger.error(`No user with user id ${id} was found.`, null);
      throw new NotFoundException('User not found.');
    }
    return document;
  }
}
