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
import { OrganisationDto } from './dto/organisation.dto.js';
import { OrganisationService } from './organisation.service.js';

@Controller('org')
export class OrganisationController {
  constructor(private orgService: OrganisationService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Roles(['user'])
  @UseGuards(JwtGuard, RolesGuard)
  registerOrganisation(
    @Body() dto: OrganisationDto,
    @GetUser('sub') user: string,
  ) {
    return this.orgService.registerOrganisation(dto, user);
  }
}
