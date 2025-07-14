import { Types } from 'mongoose';

import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewRequest {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsMongoId()
  userId: Types.ObjectId;

  @IsMongoId()
  mangaId: Types.ObjectId;
}
