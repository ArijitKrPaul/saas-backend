import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../User/user.module.js';
import { InvitationController } from './invitation.controller.js';
import { Invitation, InvitationSchema } from './invitation.schema.js';
import { InvitationService } from './invitation.service.js';
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
      {
        name: Invitation.name,
        schema: InvitationSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
  controllers: [OrganisationController, InvitationController],
  providers: [OrganisationService, InvitationService],
})
export class OrganistionModule {}
