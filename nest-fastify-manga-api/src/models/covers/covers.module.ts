import { Module } from '@nestjs/common';
import { CoversController } from './covers.controller';
import { CoversService } from './covers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cover, CoverSchema } from './covers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cover.name, schema: CoverSchema }]),
  ],
  controllers: [CoversController],
  providers: [CoversService],
})
export class CoversModule {}
