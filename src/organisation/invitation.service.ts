import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { createHash, randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { Resend } from 'resend';
import { User, UserDocument } from '../User/user.schema.js';
import { InvitationDto } from './dto/organisation.dto.js';
import { Invitation, InvitationDocument } from './invitation.schema.js';

@Injectable()
export class InvitationService {
  private resend: Resend;
  constructor(
    @InjectModel(Invitation.name)
    private invitationModel: Model<InvitationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendInvitation(dto: InvitationDto, orgId: string) {
    //generate token
    //hash token
    //generate invitation link
    //send invitation link using resend
    //store the hash token in db
    //send the original token through mail in the link

    const token = randomBytes(32).toString('hex');

    const hashedToken = createHash('sha256').update(token).digest('hex');

    const frontendURL = this.configService.get('FRONTEND_URL');

    const link = `${frontendURL}/${token}`;

    const tokenDB = await this.invitationModel.create({
      email: dto.email,
      organisationId: orgId,
      role: dto.role,
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const { data, error } = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: dto.email,
      subject: 'You have been invited',
      html: `
            <h2>You've been invited!</h2>
    
            <p>
              You have been invited to join an organisation.
            </p>
    
            <a href="${link}">
              Accept Invitation
            </a>
    
            <p>This invitation expires in 7 days.</p>
          `,
    });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to send the message:${error.message}`,
      );
    }

    return {
      token: tokenDB,
      msg: 'invitation sent successfully',
    };
  }

  async acceptInvitation(token: string, userId: string) {
    //hash the token again and search it
    //check if it has expired or not
    //if not expired fetch organisation id
    //add organisation id to the user
    //change role to member
    //change the accepted boolean to true and check it as well before updating the records.

    const hashToken = createHash('sha256').update(token).digest('hex');

    const existingInvitation = await this.invitationModel.findOne({
      tokenHash: hashToken,
      accepted: false,
    });

    if (!existingInvitation) {
      throw new ForbiddenException('Invalid Invitation');
    }

    const isExpired = new Date(Date.now()) > existingInvitation.expiresAt;

    if (isExpired) {
      throw new ForbiddenException('Invitation expired');
    }
    const existingUser = await this.userModel.findById(userId);

    if (!existingUser) {
      throw new ForbiddenException('No user found');
    }

    if (existingUser.email !== existingInvitation.email) {
      throw new ForbiddenException(
        'This mail was sent to a different email address',
      );
    }

    existingUser.organisation_id = existingInvitation.organisationId;

    existingUser.role = 'member';

    await existingUser.save();

    existingInvitation.accepted = true;

    await existingInvitation.save();

    const user = await this.userModel
      .findById(userId)
      .select('-password -refreshToken');

    return {
      user: user,
    };
  }
}
