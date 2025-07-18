import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GENRES } from '../constants/genres';
import { THEMES } from '../constants/themes';
import { TYPES } from '../constants/types';
import { STATUS } from '../constants/status';
import { Type } from 'class-transformer';

export class FindMangasRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  synopsis?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsEnum(GENRES, { each: true })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsEnum(THEMES, { each: true })
  themes?: string[];

  @IsOptional()
  @IsEnum(TYPES)
  type?: string;

  @IsOptional()
  @IsEnum(STATUS)
  status?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  nsfw?: boolean;

  @IsOptional()
  @IsMongoId()
  @IsString()
  userId?: string;
}
