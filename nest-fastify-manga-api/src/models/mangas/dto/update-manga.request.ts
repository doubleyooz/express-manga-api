import { Types } from 'mongoose';
import { Exclude } from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsString,
  IsEnum,
  IsOptional,
  ValidateIf,
  IsDefined,
} from 'class-validator';
import { GENRES } from '../constants/genres';
import { THEMES } from '../constants/themes';
import { TYPES } from '../constants/types';
import { STATUS } from '../constants/status';
import { Type } from 'class-transformer';
import { Manga } from '../mangas.schema';

export class UpdateMangaRequest {
  @IsString()
  @IsOptional()
  synopsis: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsArray()
  @IsOptional()
  @IsEnum(GENRES, { each: true })
  genres: string[];

  @IsArray()
  @IsOptional()
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

  @Exclude()
  userId: Types.ObjectId;

  @ValidateIf(
    (o: Manga) =>
      !o.synopsis &&
      !o.title &&
      !o.themes &&
      !o.genres &&
      !o.status &&
      !o.type &&
      !o.nsfw,
  )
  @IsDefined({
    message:
      "At least one of ['synopsis', 'themes', 'genres', 'status', 'type', 'nsfw', 'title'] must be provided",
  })
  protected readonly checkAtLeastOne: undefined;
}
