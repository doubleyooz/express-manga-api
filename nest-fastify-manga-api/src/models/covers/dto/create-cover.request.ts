import { Types } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsMongoId,
  IsNumber,
} from 'class-validator';

import { LANGUAGES } from 'src/models/mangas/constants/languages';

export class CreateCoverRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  volume: number;

  @IsMongoId()
  mangaId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @IsEnum(LANGUAGES)
  language: string;
}
