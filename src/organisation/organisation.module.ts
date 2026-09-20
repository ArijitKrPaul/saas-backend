import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../User/user.module.js';
import { OrganisationController } from './organisation.controller.js';
import { Organisation, OrganisationSchema } from './organisation.schema.js';
import { OrganisationService } from './organisation.service.js';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Organisation.name,
        schema: OrganisationSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
  controllers: [OrganisationController],
  providers: [OrganisationService],
})
export class OrganistionModule {}
