import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GENRES } from './constants/genres';
import { THEMES } from './constants/themes';
import { TYPES } from './constants/types';
import { STATUS } from './constants/status';
import { Chapter } from '../chapters/chapters.schema';
import { User } from '../users/users.schema';
import { Cover } from '../covers/covers.schema';
import { AbstractDocument } from 'src/database/abstract.schema';

export type MangaDocument = HydratedDocument<Manga>;

@Schema()
export class Manga extends AbstractDocument {
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

  @Prop({ type: [{ type: Types.ObjectId, ref: Cover.name }], default: [] })
  covers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Chapter.name }], default: [] })
  chapters: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
  subscribers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
