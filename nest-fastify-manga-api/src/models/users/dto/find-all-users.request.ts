import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';

export class FindAllUsersRequest {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsMongoId()
  @IsString()
  @IsOptional()
  _id: string;
}
