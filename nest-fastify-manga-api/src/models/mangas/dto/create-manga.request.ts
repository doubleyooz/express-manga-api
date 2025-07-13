import { Types } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { GENRES } from '../constants/genres';
import { THEMES } from '../constants/themes';
import { TYPES } from '../constants/types';
import { STATUS } from '../constants/status';
import { Type } from 'class-transformer';

export class CreateMangaRequest {
  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsNotEmpty()
  @IsEnum(GENRES, { each: true })
  genres: string[];

  @IsArray()
  @IsNotEmpty()
  @IsEnum(THEMES, { each: true })
  themes: string[];

  @IsOptional()
  @IsEnum(TYPES)
  type: string;

  @IsOptional()
  @IsEnum(STATUS)
  status: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  nsfw: boolean;

  @IsMongoId()
  owner: Types.ObjectId;

  @Exclude()
  @Transform(() => [])
  covers: Types.ObjectId[];

  @Exclude()
  @Transform(() => [])
  chapters: Types.ObjectId[];

  @Exclude()
  @Transform(() => [])
  subscribers: Types.ObjectId[];

  @Exclude()
  @Transform(() => [])
  likes: Types.ObjectId[];
}
