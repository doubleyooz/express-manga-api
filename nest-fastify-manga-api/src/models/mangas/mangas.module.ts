import { Module } from '@nestjs/common';
import { MangasController } from './mangas.controller';
import { MangasService } from './mangas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Manga, MangaSchema } from './mangas.schema';
import { MangasRepository } from './mangas.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
  ],
  controllers: [MangasController],
  providers: [MangasService, MangasRepository],
})
export class MangasModule {}
