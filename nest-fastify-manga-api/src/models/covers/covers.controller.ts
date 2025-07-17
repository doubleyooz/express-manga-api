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
import { FileInterceptor, File, NoFilesInterceptor } from '@nest-lab/fastify-multer';
import { CoversService } from './covers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindCoversRequest } from './dto/find-covers.request';
import { CreateCoverRequest } from './dto/create-cover.request';
import { ParseFilePipe } from 'src/common/pipes/image.pipe';
import { UpdateCoverRequest } from './dto/update-cover.request';

@Controller('covers')
export class CoversController {
  constructor(private readonly _service: CoversService) { }
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  create(
    @Body() request: CreateCoverRequest,
    @UploadedFiles(new ParseFilePipe()) files: Array<File>,

  ) {
    console.log(request, files);
    return this._service.create(request);
  }

  @Get()
  findAll(@Query() request: FindCoversRequest) {
    return this._service.find({ ...request });
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    const cover = await this._service.findById(id);
    if (!cover) {
      throw new NotFoundException(`Cover with ID ${id} not found`);
    }
    return cover;
  }

  @Put(':id')
  @UseInterceptors(NoFilesInterceptor())
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() request: UpdateCoverRequest,
  ) {
    const result = await this._service.update(id, request);
    if (!result) {
      throw new NotFoundException(`Cover with ID ${id} not found`);
    }
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: Types.ObjectId) {
    const result = await this._service.deleteById(id);
    if (!result) {
      throw new NotFoundException(`Cover with ID ${id} not found`);
    }
    return { message: `Cover with ID ${id} deleted successfully` };
  }
}
