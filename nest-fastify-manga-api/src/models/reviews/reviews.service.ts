import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery } from 'mongoose';

import { Review, ReviewDocument } from './reviews.schema';
import { CreateReviewRequest } from './dto/create-review.request';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly _repository: ReviewsRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(data: CreateReviewRequest) {
    console.log(data);
    try {
      const newReview = await this._repository.create({
        ...data,
      });
      console.log(newReview);
      return newReview;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException({
        code: err.code,
        msg: 'Error while creating review',
      });
    }
  }

  async find(filter: FilterQuery<ReviewDocument>) {
    const queryOptions = { where: undefined };
    console.log({ filter });
    // Check if filter is empty
    if (Object.keys(filter).length > 0 && filter.constructor === Object) {
      queryOptions.where = { ...filter };
    }

    const result = await this._repository.find(queryOptions);

    if (result.length === 0) {
      throw new NotFoundException('Review not Found');
    }

    return result;
  }

  async findById(filter: FilterQuery<ReviewDocument>): Promise<Review> {
    const id = filter._id;

    const document = await this._repository.findOne(id);
    if (!document) {
      throw new NotFoundException('Review not found.');
    }
    return document;
  }
}
