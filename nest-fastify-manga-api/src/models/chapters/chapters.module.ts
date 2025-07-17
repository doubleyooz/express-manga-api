import { forwardRef, Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { Chapter, ChapterSchema } from './chapters.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChaptersRepository } from './chapters.repository';
import { MangasModule } from '../mangas/mangas.module';
import { LocalStorageService } from 'src/common/storage/local-storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    forwardRef(() => MangasModule),
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService, ChaptersRepository, LocalStorageService],
  exports: [ChaptersRepository], 
})
export class ChaptersModule {}
