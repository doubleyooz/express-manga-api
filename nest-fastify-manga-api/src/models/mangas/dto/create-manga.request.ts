import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsMongoId,
  ValidateNested,
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

  @IsOptional()
  @ValidateNested({ each: true })
  @IsMongoId({ each: true })
  chapters: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @IsMongoId({ each: true })
  subscribers: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @IsMongoId({ each: true })
  likes: string[];

  @IsMongoId()
  @IsString()
  owner: string;
}
