import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../User/user.schema.js';
import { OrganisationDto } from './dto/organisation.dto.js';
import { Organisation, OrganisationDocument } from './organisation.schema.js';

@Injectable({})
export class OrganisationService {
  constructor(
    @InjectModel(Organisation.name)
    private organisationModel: Model<OrganisationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}
  async registerOrganisation(dto: OrganisationDto, user: string) {
    const existingDepartment = await this.organisationModel.findOne({
      email: dto.email,
    });

    if (existingDepartment) {
      throw new ForbiddenException('Company email already taken');
    }

    const organistion = await this.organisationModel.create({
      name: dto.name,
      email: dto.email,
      address: dto.address,
    });

    const existingUser = await this.userModel
      .findByIdAndUpdate(
        user,
        {
          $set: {
            organisation_id: organistion._id,
            role: 'ADMIN',
          },
        },
        {
          returnDocument: 'after',
        },
      )
      .select('-password -refreshToken');

    return {
      updatedUser: existingUser,
    };
  }
}
