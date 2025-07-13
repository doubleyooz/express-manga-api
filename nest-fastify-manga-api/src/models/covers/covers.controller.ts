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
import { CoversService } from './covers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindAllMangasRequest } from '../mangas/dto/find-mangas.request';
import { CreateCoverRequest } from './dto/create-cover.request';

@Controller('covers')
export class CoversController {
  constructor(private readonly coversService: CoversService) {}
  @Post()
  @UseInterceptors(FileInterceptor('files', { limits: { files: 10 } }))
  createUser(
    @Body() request: CreateCoverRequest,
    @UploadedFiles() files: Array<File>,
  ) {
    console.log(request, files);
    return this.coversService.create(request);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() request: FindAllMangasRequest) {
    return this.coversService.findAll({ ...request });
  }
}
