import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../User/user.schema.js';
import { MemberDto, ProjectDto } from './dto/project.dto.js';
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
            project_id: project._id,
            organisation_id: orgId,
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

  async getProject(orgId: string) {
    //find projects related to that particular department
    //return them

    const project = await this.projectModel.find({
      deptId: orgId,
    });

    return {
      msg: 'all projects found',
      projects: project,
    };
  }

  async addProjectMember(dto: MemberDto, orgId: string) {
    //first check if project exists or not
    //check if the project belongs to that particulat dept or not
    //change the role of the selected user
    //add project id to the user
    //send feedback

    const existingUser = await this.userMOdel.findById(dto.userid);

    if (!existingUser) {
      throw new ForbiddenException('User not found');
    }

    if (existingUser?.project_id?.toString() === dto.projectId) {
      throw new ForbiddenException('User is already a part of the project');
    }

    existingUser.project_id = new Types.ObjectId(dto.projectId);
    existingUser.role = 'project_member';
    await existingUser.save();

    const updatedUser = await this.userMOdel
      .findById(dto.userid)
      .select('-password -refreshToken');

    return {
      msg: 'project member added',
      user: updatedUser,
    };
  }
}
