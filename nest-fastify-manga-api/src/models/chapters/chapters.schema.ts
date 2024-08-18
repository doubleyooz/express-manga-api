import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CoverImage } from '../../common/interfaces/image.interface';

export type ChapterDocument = Document & Chapter;

@Schema()
export class Chapter {
  @Prop([
    {
      url: String,
      number: Number,
    },
  ])
  pages?: CoverImage[];

  @Prop()
  title: string;

  @Prop()
  content: string; // Assuming you want to store some form of content or reference to content here

  // Add other properties relevant to a chapter
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
