import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../User/user.module.js';
import { OrganistionModule } from '../organisation/organisation.module.js';
import { ProjectController } from './project.controller.js';
import { Project, ProjectSchema } from './project.schema.js';
import { ProjectService } from './project.service.js';

@Module({
  imports: [
    UserModule,
    OrganistionModule,
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
