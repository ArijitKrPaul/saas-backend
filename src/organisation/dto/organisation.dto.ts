import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OrganisationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
