import { Types } from 'mongoose';

import { IsMongoId, IsOptional } from 'class-validator';

export class FindReviewRequest {
  @IsOptional()
  @IsMongoId()
  userId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  mangaId?: Types.ObjectId;
}
