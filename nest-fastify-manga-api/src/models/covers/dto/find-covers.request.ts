import { Types } from 'mongoose';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { LANGUAGES } from '../../../models/mangas/constants/languages';

export class FindCoversRequest {
  @IsOptional()
  @IsEnum(LANGUAGES)
  language: string;

  @IsOptional()
  @IsMongoId()
  mangaId: Types.ObjectId;
}
