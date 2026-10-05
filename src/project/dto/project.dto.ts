import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

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

export class MemberDto {
  @IsNotEmpty()
  userid: string;

  @IsNotEmpty()
  projectId: Types.ObjectId | string;
}
