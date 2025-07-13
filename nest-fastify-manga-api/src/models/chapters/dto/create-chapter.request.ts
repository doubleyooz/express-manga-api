import { Types } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsMongoId,
  IsNumber,
} from 'class-validator';

import { LANGUAGES } from 'src/models/mangas/constants/languages';
import { Exclude } from 'class-transformer';

export class CreateChapterRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  number: number;

  @IsMongoId()
  mangaId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @IsEnum(LANGUAGES)
  language: string;

  @Exclude()
  views: number;
}
