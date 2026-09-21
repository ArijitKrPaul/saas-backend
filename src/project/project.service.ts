import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../User/user.schema.js';
import { ProjectDto } from './dto/project.dto.js';
import { Project, ProjectDocument } from './project.schema.js';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(User.name)
    private userMOdel: Model<UserDocument>,
    // @InjectModel(Organisation.name)
    // private organisationModel: Model<OrganisationDocument>,
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
  ) {}
  async addProject(dto: ProjectDto, user: string, orgId: string) {
    const existingUser = await this.userMOdel.findById(user);

    if (!existingUser) {
      throw new ForbiddenException('User not found');
    }

    const project = await this.projectModel.create({
      name: dto.name,
      project_leader: dto.leader,
      description: dto.description,
      deptId: orgId,
    });

    const leader = await this.userMOdel
      .findByIdAndUpdate(
        dto.leader,
        {
          $set: {
            role: 'project_leader',
          },
        },
        {
          returnDocument: 'after',
        },
      )
      .select('-password -refreshToken');

    return {
      leader: leader,
      project: project,
    };
  }
}
