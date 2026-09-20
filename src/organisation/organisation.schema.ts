import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Organisation {
  @Prop({ required: true, lowercase: true, unique: true })
  name: string;

  @Prop({ required: true, lowercase: true })
  address: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;
}

export type OrganisationDocument = HydratedDocument<Organisation>;

export const OrganisationSchema = SchemaFactory.createForClass(Organisation);
