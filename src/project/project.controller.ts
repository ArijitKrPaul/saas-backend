import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { GetUser } from '../auth/decorator/user.decorator.js';
import { JwtGuard } from '../auth/guard/jwt.guard.js';
import { RolesGuard } from '../auth/guard/roles.guard.js';
import { ProjectDto } from './dto/project.dto.js';
import { ProjectService } from './project.service.js';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('add')
  @Roles(['admin'])
  @UseGuards(JwtGuard, RolesGuard)
  addProject(
    @Body() dto: ProjectDto,
    @GetUser('organisationId') orgId: string,
    @GetUser('sub') user: string,
  ) {
    return this.projectService.addProject(dto, user, orgId);
  }

  @Get('all')
  @Roles(['admin'])
  @UseGuards(JwtGuard, RolesGuard)
  getProjects(@GetUser('organisationId') orgId: string) {
    return this.projectService.getProject(orgId);
  }
}
