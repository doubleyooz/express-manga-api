import { FileInterceptor, NoFilesInterceptor } from '@nest-lab/fastify-multer';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FilterQuery, Types } from 'mongoose';

import { ChaptersService } from '../chapters/chapters.service';
import { CreateChapterRequest } from './dto/create-chapter.request';
import { FindChaptersRequest } from './dto/find-chapters.request';
import { UpdateChapterRequest } from './dto/update-chapter.request';
import { ParseFilePipe } from '../../common/pipes/image.pipe';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ImageInterface } from 'src/common/interfaces/image.interface';


@Controller('chapters')
export class ChaptersController {
  constructor(private readonly _service: ChaptersService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  create(
    @Body() request: CreateChapterRequest,
    @UploadedFiles(new ParseFilePipe({ maxFiles: 200 })) files: Array<ImageInterface>,
  ) {
    console.log(request, files);
    return this._service.create(request);
  }

  @Get()
  findAll(@Query() request: FindChaptersRequest) {
    return this._service.find({ ...request });
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    const document = await this._service.findById(id);
    if (!document) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return document;
  }

  @Put(':id')
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() request: UpdateChapterRequest,
  ) {
    const result = await this._service.update(id, request);
    if (!result) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: Types.ObjectId) {
    const result = await this._service.deleteById(id);
    if (!result) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return { message: `Chapter with ID ${id} deleted successfully` };
  }
}

