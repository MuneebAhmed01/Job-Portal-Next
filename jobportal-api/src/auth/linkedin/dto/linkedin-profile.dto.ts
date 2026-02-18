import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class LinkedInProfileDto {
  @IsString()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsUrl()
  @IsOptional()
  profilePicture?: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
