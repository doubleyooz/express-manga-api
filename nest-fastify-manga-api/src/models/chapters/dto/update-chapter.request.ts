import { Types } from 'mongoose';
import { Exclude } from 'class-transformer';

import {
  IsString,
  IsEnum,
  IsOptional,
  ValidateIf,
  IsDefined,
  IsNumber,
} from 'class-validator';
import { LANGUAGES } from '../../../models/mangas/constants/languages';
import { Chapter } from '../chapters.schema';

export class UpdateChapterRequest {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  number?: number;

  @IsOptional()
  @IsString()
  @IsEnum(LANGUAGES)
  language?: string;

  @Exclude()
  mangaId?: Types.ObjectId;

  @Exclude()
  views?: number;

  @ValidateIf(
    (o: Chapter) =>
      !o.language &&
      !o.title &&
      !o.number &&
      !o.description
  )
  @IsDefined({
    message:
      "At least one of ['language', 'title', 'number', 'description'] must be provided",
  })
  protected readonly checkAtLeastOne?: undefined;
}
