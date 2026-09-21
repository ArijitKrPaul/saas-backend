import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  leader: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
