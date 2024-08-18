import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GENRES } from './constants/genres';
import { THEMES } from './constants/themes';
import { TYPES } from './constants/types';
import { STATUS } from './constants/status';
import { LANGUAGES } from './constants/languages';
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

  @Prop({ enum: GENRES })
  genres: string[];

  @Prop({ enum: THEMES })
  themes: string[];

  @Prop({ enum: TYPES })
  type: string;

  @Prop({})
  synopsis: string;

  @Prop({ default: 0 })
  nChapters: number;

  @Prop({ enum: STATUS })
  status: string;

  @Prop({ default: false })
  nsfw: boolean;

  @Prop({ enum: LANGUAGES })
  languages: string[];

  @Prop([{ type: Types.ObjectId, ref: () => Chapter.name }])
  chapters: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: () => User.name }])
  subscribers: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: () => User.name }])
  likes: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: () => User.name })
  owner: Types.ObjectId;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
