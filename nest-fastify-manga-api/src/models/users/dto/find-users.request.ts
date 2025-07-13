import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';

export class FindUsersRequest {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsMongoId()
  @IsOptional()
  _id: string;
}
