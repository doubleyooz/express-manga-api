import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReviewsService } from './reviews.service';
import { CreateReviewRequest } from './dto/create-review.request';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FindReviewRequest } from './dto/find-reviews.request';
import { NoFilesInterceptor } from '@nest-lab/fastify-multer';
import { UpdateReviewRequest } from './dto/update-review.request';

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
  
  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    const document = await this._service.findById(id);
    if (!document) {
      throw new NotFoundException(`Manga with ID ${id} not found`);
    }
    return document;
  }

  @Put(':id')
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() request: UpdateReviewRequest,
  ) {
    const result = await this._service.update(id, request);
    if (!result) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: Types.ObjectId) {
    const result = await this._service.deleteById(id);
    if (!result) {
      throw new NotFoundException(`Manga with ID ${id} not found`);
    }
    return { message: `Manga with ID ${id} deleted successfully` };
  }
}

