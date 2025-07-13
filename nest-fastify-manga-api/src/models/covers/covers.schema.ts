import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { ImageInterface } from '../../common/interfaces/image.interface';
import { LANGUAGES } from '../mangas/constants/languages';
import { MANGA } from '../mangas/constants/manga';
import { ImageSchema } from 'src/common/schema/image.schema';
import { AbstractDocument } from 'src/database/abstract.schema';

export type CoverDocument = HydratedDocument<Cover>;

@Schema()
export class Cover extends AbstractDocument {
  @Prop([ImageSchema])
  files?: ImageInterface[];

  @Prop()
  title: string;

  @Prop()
  volume: number;

  @Prop({ type: Types.ObjectId, ref: MANGA })
  mangaId: Types.ObjectId;

  @Prop({ enum: LANGUAGES })
  language: string;
}

export const CoverSchema = SchemaFactory.createForClass(Cover);
