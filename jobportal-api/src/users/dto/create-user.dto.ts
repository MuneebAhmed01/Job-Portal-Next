import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../lib/prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
