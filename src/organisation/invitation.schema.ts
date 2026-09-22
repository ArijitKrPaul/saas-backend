import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ required: true })
  email: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organisation',
    required: true,
  })
  organisationId: Types.ObjectId;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  tokenHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  accepted: boolean;
}

export type InvitationDocument = HydratedDocument<Invitation>;

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
