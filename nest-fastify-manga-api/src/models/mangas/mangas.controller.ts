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
import { FileInterceptor, File } from '@nest-lab/fastify-multer';
import { MangasService } from './mangas.service';
import { CreateMangaRequest } from './dto/create-manga.request';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FindMangasRequest } from './dto/find-mangas.request';

@Controller('mangas')
export class MangasController {
  constructor(private readonly _service: MangasService) {}
  @Post()
  @UseInterceptors(FileInterceptor('files', { limits: { files: 10 } }))
  create(
    @Body() request: CreateMangaRequest,
    @UploadedFiles() files: Array<File>,
  ) {
    console.log(request, files);
    return this._service.create(request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() request: FindMangasRequest) {
    return this._service.find({ ...request });
  }
}
