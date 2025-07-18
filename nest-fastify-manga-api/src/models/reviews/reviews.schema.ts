import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/users.schema';
import { Manga } from '../mangas/mangas.schema';
import { AbstractDocument } from '../../database/abstract.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review extends AbstractDocument {
  @Prop()
  text: string;

  @Prop()
  rating: number;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Manga.name })
  mangaId: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
