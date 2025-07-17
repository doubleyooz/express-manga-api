import { FileInterceptor } from '@nest-lab/fastify-multer';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateChapterRequest } from './dto/create-chapter.request';
import { ChaptersService } from '../chapters/chapters.service';
import { FindChaptersRequest } from './dto/find-chapters.request';
import { ParseFilePipe } from 'src/common/pipes/image.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  createUser(
    @Body() request: CreateChapterRequest,
    @UploadedFiles(new ParseFilePipe({ maxFiles: 200 })) files: Array<File>,
  ) {
    console.log(request, files);
    return this.chaptersService.create(request);
  }

  @Get()
  findAll(@Query() request: FindChaptersRequest) {
    return this.chaptersService.find({ ...request });
  }
}
