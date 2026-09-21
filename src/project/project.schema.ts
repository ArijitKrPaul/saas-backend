import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Project {
  @Prop({ required: true, lowercase: true, unique: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  project_leader: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' })
  deptId: string;

  @Prop({ required: true, default: 'Ongoing' })
  status: string;

  @Prop({ required: true })
  description: string;
}

export type ProjectDocument = HydratedDocument<Project>;

export const ProjectSchema = SchemaFactory.createForClass(Project);
