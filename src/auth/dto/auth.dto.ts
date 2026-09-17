import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
