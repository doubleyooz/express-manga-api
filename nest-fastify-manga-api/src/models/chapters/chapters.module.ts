import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { Chapter, ChapterSchema } from './chapters.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChaptersRepository } from './chapters.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService, ChaptersRepository],
})
export class ChaptersModule {}
