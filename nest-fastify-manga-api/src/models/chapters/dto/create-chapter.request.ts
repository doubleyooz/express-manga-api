import { Types } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsMongoId,
  IsNumber,
} from 'class-validator';

import { Exclude } from 'class-transformer';
import { LANGUAGES } from '../../mangas/constants/languages';

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
