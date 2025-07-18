import { forwardRef, Module } from '@nestjs/common';
import { CoversController } from './covers.controller';
import { CoversService } from './covers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cover, CoverSchema } from './covers.schema';
import { CoversRepository } from './covers.repository';
import { MangasModule } from '../mangas/mangas.module';
import { LocalStorageService } from '../../common/storage/local-storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cover.name, schema: CoverSchema }]),
    forwardRef(() => MangasModule),
  ],
  controllers: [CoversController],
  providers: [CoversService, CoversRepository, LocalStorageService],
  exports: [CoversRepository], 
})
export class CoversModule {}
