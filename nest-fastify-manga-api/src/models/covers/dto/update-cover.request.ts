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
import { Cover } from '../covers.schema';

export class UpdateCoverRequest {
  @IsString()
  @IsOptional()
  title: string;


  @IsOptional()
  @IsNumber()
  volume: number;

  @IsOptional()
  @IsString()
  @IsEnum(LANGUAGES)
  language: string;

  @Exclude()
  mangaId: Types.ObjectId;

  @ValidateIf(
    (o: Cover) =>
      !o.language &&
      !o.title &&
      !o.volume 
  )
  @IsDefined({
    message:
      "At least one of ['language', 'title', 'volume'] must be provided",
  })
  protected readonly checkAtLeastOne: undefined;
}
