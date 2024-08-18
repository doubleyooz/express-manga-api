import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserRequest } from './dto/create-user.request';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async createUser(data: CreateUserRequest) {
    console.log(data);
    try {
      const newUser = await this.userModel.create({
        ...data,
        password: await bcrypt.hash(
          data.password,
          this.configService.get<number>('HASH_SALT'),
        ),
      });
      console.log(newUser);
      return newUser;
    } catch (err) {
      console.log(err);
      if (err.code == '11000') {
        throw new UnprocessableEntityException('Email already taken');
      }
      throw new InternalServerErrorException({
        code: err.code,
        msg: 'Error while creating user',
      });
    }
  }

  async getUser(
    filter: FilterQuery<UserDocument>,
    select: FilterQuery<UserDocument> = {},
  ) {
    return await this.userModel.findOne(
      {
        ...filter,
      },
      select,
    );
  }

  async findAll(filter: FilterQuery<UserDocument>) {
    return await this.userModel.find({
      where: filter,
    });
  }

  async findById(filter: FilterQuery<UserDocument>): Promise<User> {
    const id = filter._id;

    const document = await this.userModel.findById(id).exec();
    if (!document) {
      this.logger.error(`No user with user id ${id} was found.`, null);
      throw new NotFoundException('User not found.');
    }
    return document;
  }

  async updateTokenVersion(id: string): Promise<User> {
    const document = await this.userModel.findOneAndUpdate(
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
