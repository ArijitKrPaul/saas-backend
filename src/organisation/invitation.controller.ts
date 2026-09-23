import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { GetUser } from '../auth/decorator/user.decorator.js';
import { JwtGuard } from '../auth/guard/jwt.guard.js';
import { RolesGuard } from '../auth/guard/roles.guard.js';
import { InvitationDto } from './dto/organisation.dto.js';
import { InvitationService } from './invitation.service.js';

@Controller('invite')
export class InvitationController {
  constructor(private invitationService: InvitationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('add')
  @Roles(['admin'])
  @UseGuards(JwtGuard, RolesGuard)
  sendInvite(
    @Body() dto: InvitationDto,
    @GetUser('organisationId') orgId: string,
  ) {
    return this.invitationService.sendInvitation(dto, orgId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('accept')
  @Roles(['user'])
  @UseGuards(JwtGuard, RolesGuard)
  accept(@Body('token') dto: string, @GetUser('sub') userId: string) {
    return this.invitationService.acceptInvitation(dto, userId);
  }
}
