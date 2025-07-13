import { Types } from 'mongoose';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { LANGUAGES } from 'src/models/mangas/constants/languages';

export class FindCoversRequest {
  @IsOptional()
  @IsEnum(LANGUAGES)
  language: string;

  @IsOptional()
  @IsMongoId()
  mangaId: Types.ObjectId;
}
