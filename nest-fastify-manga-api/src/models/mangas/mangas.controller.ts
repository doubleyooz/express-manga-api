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
import { FindAllMangasRequest } from './dto/find-all-mangas.request';

@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}
  @Post()
  @UseInterceptors(FileInterceptor('files', { limits: { files: 10 } }))
  createUser(
    @Body() request: CreateMangaRequest,
    @UploadedFiles() files: Array<File>,
  ) {
    console.log(request, files);
    return this.mangasService.createManga(request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() request: FindAllMangasRequest) {
    return this.mangasService.findAll({ ...request });
  }
}
