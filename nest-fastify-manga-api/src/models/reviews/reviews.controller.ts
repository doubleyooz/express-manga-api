import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewRequest } from './dto/create-review.request';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FindReviewRequest } from './dto/find-reviews.request';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly _service: ReviewsService) {}
  @Post()
  create(@Body() request: CreateReviewRequest) {
    console.log(request);
    return this._service.create(request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() request: FindReviewRequest) {
    return this._service.find({ ...request });
  }
}
