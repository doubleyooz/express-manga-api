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
import { FindCoversRequest } from './dto/find-covers.request';
import { CreateCoverRequest } from './dto/create-cover.request';

@Controller('covers')
export class CoversController {
  constructor(private readonly coversService: CoversService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files', { limits: { files: 4 } }))
  createUser(
    @Body() request: CreateCoverRequest,
    @UploadedFiles() files: Array<File>,
  ) {
    console.log(request, files);
    return this.coversService.create(request);
  }

  @Get()
  findAll(@Query() request: FindCoversRequest) {
    return this.coversService.find({ ...request });
  }
}
