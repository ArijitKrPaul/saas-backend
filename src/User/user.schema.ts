import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, lowercase: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, lowercase: true, unique: true })
  email: string;

  @Prop({ lowercase: true, default: 'user' })
  role: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organisation',
    default: null,
  })
  organisation_id: Types.ObjectId | null;

  @Prop({
    default: null,
  })
  refreshToken: string;

  @Prop({ default: null, type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project_id: Types.ObjectId | null;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
