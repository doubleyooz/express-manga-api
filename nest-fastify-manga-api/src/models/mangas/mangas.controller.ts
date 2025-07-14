import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MangasService } from './mangas.service';
import { CreateMangaRequest } from './dto/create-manga.request';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FindMangasRequest } from './dto/find-mangas.request';

@Controller('mangas')
export class MangasController {
  constructor(private readonly _service: MangasService) {}
  @Post()
  create(@Body() request: CreateMangaRequest) {
    return this._service.create(request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() request: FindMangasRequest) {
    return this._service.find({ ...request });
  }
}
