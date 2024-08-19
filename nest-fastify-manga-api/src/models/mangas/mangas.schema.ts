import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GENRES } from './constants/genres';
import { THEMES } from './constants/themes';
import { TYPES } from './constants/types';
import { STATUS } from './constants/status';
import { Chapter } from '../chapters/chapters.schema';
import { User } from '../users/users.schema';
import { CoverImage } from '../../common/interfaces/image.interface';

export type MangaDocument = HydratedDocument<Manga>;

@Schema()
export class Manga {
  @Prop([
    {
      url: String,
      number: Number,
    },
  ])
  coverImage?: CoverImage[];

  @Prop({ unique: true })
  title: string;

  @Prop({ type: [{ type: String, enum: GENRES }] })
  genres: string[];

  @Prop({ type: [{ type: String, enum: THEMES }] })
  themes: string[];

  @Prop({ enum: TYPES, default: TYPES[0] })
  type: string;

  @Prop({ enum: STATUS, default: STATUS[0] })
  status: string;

  @Prop({})
  synopsis: string;

  @Prop({ default: false })
  nsfw: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: Chapter.name }] })
  chapters: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  subscribers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  likes: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
