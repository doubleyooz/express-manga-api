import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  role: string;

  @Exclude()
  tokenVersion: number;

  @Exclude()
  resetLink: string;

  @Exclude()
  active: boolean;
}
