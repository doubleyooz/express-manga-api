import { Types } from 'mongoose';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MangasService } from './mangas.service';
import { CreateMangaRequest } from './dto/create-manga.request';
import { UpdateMangaRequest } from './dto/update-manga.request';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FindMangasRequest } from './dto/find-mangas.request';
import { NoFilesInterceptor } from '@nest-lab/fastify-multer';

@Controller('mangas')
export class MangasController {
  constructor(private readonly _service: MangasService) {}
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(JwtAuthGuard)
  create(@Body() request: CreateMangaRequest) {
    return this._service.create(request);
  }

  @Get()
  findAll(@Query() request: FindMangasRequest) {
    return this._service.find({ ...request });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const manga = await this._service.findById(Types.ObjectId);
    if (!manga) {
      throw new NotFoundException(`Manga with ID ${id} not found`);
    }
    return manga;
  }

  @Put(':id')
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() request: UpdateMangaRequest,
  ) {
    const updatedManga = await this._service.update(id, request);
    if (!updatedManga) {
      throw new NotFoundException(`Manga with ID ${id} not found`);
    }
    return updatedManga;
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
