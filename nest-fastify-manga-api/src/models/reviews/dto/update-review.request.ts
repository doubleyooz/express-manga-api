import { Types } from 'mongoose';
import { Exclude } from 'class-transformer';

import {
  IsString,
  IsEnum,
  IsOptional,
  ValidateIf,
  IsDefined,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { Review } from '../reviews.schema';

export class UpdateReviewRequest {
  @IsString()
  @IsOptional()
  text?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @Exclude()
  mangaId?: Types.ObjectId;

  @Exclude()
  userId?: Types.ObjectId;

  @ValidateIf(
    (o: Review) =>
      !o.text &&
      !o.rating
  )
  @IsDefined({
    message:
      "At least one of ['text', 'rating'] must be provided",
  })
  protected readonly checkAtLeastOne?: undefined;
}
