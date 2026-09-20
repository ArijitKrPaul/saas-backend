import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/user.decorator.js';
import { JwtGuard } from '../auth/guard/jwt.guard.js';
import { OrganisationDto, UserDto } from './dto/organisation.dto.js';
import { OrganisationService } from './organisation.service.js';

@Controller('org')
export class OrganisationController {
  constructor(private orgService: OrganisationService) {}

  @Post('register')
  @UseGuards(JwtGuard)
  registerOrganisation(@Body() dto: OrganisationDto, @GetUser() user: UserDto) {
    return this.orgService.registerOrganisation(dto, user);
  }
}
