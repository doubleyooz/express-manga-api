import { FileInterceptor } from '@nest-lab/fastify-multer';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateChapterRequest } from './dto/create-chapter.request';
import { ChaptersService } from '../chapters/chapters.service';
import { FindChaptersRequest } from './dto/find-chapters.request';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}
  @Post()
  @UseInterceptors(FileInterceptor('files'))
  createUser(
    @Body() request: CreateChapterRequest,
    @UploadedFiles() files: Array<File>,
  ) {
    console.log(request, files);
    return this.chaptersService.create(request);
  }

  @Get()
  findAll(@Query() request: FindChaptersRequest) {
    return this.chaptersService.find({ ...request });
  }
}
