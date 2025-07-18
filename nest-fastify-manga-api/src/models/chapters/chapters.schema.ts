import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { ImageInterface } from '../../common/interfaces/image.interface';
import { LANGUAGES } from '../mangas/constants/languages';
import { MANGA } from '../mangas/constants/manga';
import { ImageSchema } from '../../common/schema/image.schema';
import { AbstractDocument } from '../../database/abstract.schema';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema()
export class Chapter extends AbstractDocument {
  @Prop([ImageSchema])
  files?: ImageInterface[];

  @Prop()
  title: string;

  @Prop()
  number: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ type: Types.ObjectId, ref: MANGA })
  mangaId: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ enum: LANGUAGES })
  language: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
