import { forwardRef, Module } from '@nestjs/common';
import { MangasController } from './mangas.controller';
import { MangasService } from './mangas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Manga, MangaSchema } from './mangas.schema';
import { MangasRepository } from './mangas.repository';
import { ChaptersModule } from '../chapters/chapters.module';
import { CoversModule } from '../covers/covers.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { UsersModule } from '../users/users.module';
import { LocalStorageService } from 'src/common/storage/local-storage.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
    ChaptersModule,
    forwardRef(() => CoversModule),
    ReviewsModule,
    UsersModule,
    
  ],
  controllers: [MangasController],
  providers: [LocalStorageService, MangasService, MangasRepository],
    exports: [MangasRepository], 
})
export class MangasModule {}
