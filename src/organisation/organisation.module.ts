import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organisation, OrganisationSchema } from './organisation.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organisation.name,
        schema: OrganisationSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class OrganistionModule {}
