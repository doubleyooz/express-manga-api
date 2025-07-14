import { Module } from '@nestjs/common';
import { CoversController } from './covers.controller';
import { CoversService } from './covers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cover, CoverSchema } from './covers.schema';
import { CoversRepository } from './covers.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cover.name, schema: CoverSchema }]),
  ],
  controllers: [CoversController],
  providers: [CoversService, CoversRepository],
})
export class CoversModule {}
