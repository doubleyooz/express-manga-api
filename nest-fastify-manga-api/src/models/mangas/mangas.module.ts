import { Module } from '@nestjs/common';
import { MangasController } from './mangas.controller';
import { MangasService } from './mangas.service';

@Module({
  controllers: [MangasController],
  providers: [MangasService],
})
export class MangasModule {}
