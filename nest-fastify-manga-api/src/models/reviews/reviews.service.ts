import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FilterQuery, Types } from 'mongoose';
import { Review, ReviewDocument } from './reviews.schema';
import { CreateReviewRequest } from './dto/create-review.request';
import { ReviewsRepository } from './reviews.repository';
import { UpdateReviewRequest } from './dto/update-review.request';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly _repository: ReviewsRepository,
    private readonly _userService: UsersRepository,
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
      throw new NotFoundException('Review not found');
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

  async update(id: Types.ObjectId, data: UpdateReviewRequest): Promise<Review> {
    try {
      const updatedDoc = await this._repository.findOneAndUpdate(
        { _id: id },
        { $set: { ...data } },
        { new: true }, // Return the updated document
      );

      if (!updatedDoc) {
        throw new NotFoundException('Review not found');
      }

      return updatedDoc;
    } catch (err) {
      console.error('Error updating review:', err);
      
      throw new InternalServerErrorException({
        code: err.code,
        msg: 'Error while updating review',
      });
    }
  }

  async deleteById(reviewId: Types.ObjectId, throwNotFound = true) {
    const session = await this._repository.startTransaction();
    try {
      // 1. Find the cover in question
      const review = await this._repository.findOneAndDelete({_id: reviewId});
  
      if (review === null && throwNotFound) {
        throw new NotFoundException();
      }

      // 2. Remove cover from the manga
      const user = await this._userService.findOneAndUpdate(
        { _id: review.userId },
        { $pull: { reviews: reviewId } },
        { session },
      )  
      
      // 3. Commit transaction first
      await this._repository.commitTransaction(session);

      return { deleted: review };
    } catch (error) {
      console.error('Error:', error);
      await this._repository.abortTransaction(session);
      throw error;
    } finally {
      await this._repository.endSession(session);
    }
  }
}
