import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  bio?: string;
}

export class CreateEmployerDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  companyName: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
