import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseFilters,
  UseGuards
} from '@nestjs/common';

import { CurrentOrg, CurrentTeam, RequiredPermissions } from '../decorators';
import { TeamCreateDTO } from '../dto';
import { Org, Team } from '../entities';
import { Permission } from '../enums';
import { UsersExceptionsFilter } from '../filters';
import { OrgExistsGuard, PermissionsGuard, TeamExistsGuard } from '../guards';
import { TeamsService } from '../services';

@UseFilters(new UsersExceptionsFilter())
@UseGuards(OrgExistsGuard, PermissionsGuard)
@Controller()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('-/org/:org/team')
  @RequiredPermissions(Permission.ORG_MEMBER)
  async list(@CurrentOrg() org: Org) {
    const teams = await this.teamsService.find(org.name);
    return teams.map(team => `${org.name}:${team.name}`);
  }

  @Put('-/org/:org/team')
  @RequiredPermissions(Permission.ORG_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentOrg() org: Org, @Body() teamData: TeamCreateDTO) {
    await this.teamsService.save(org.name, teamData.name);
    return teamData;
  }

  @Delete('-/team/:org/:team')
  @RequiredPermissions(Permission.ORG_ADMIN)
  @UseGuards(TeamExistsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentOrg() org: Org, @CurrentTeam() team: Team) {
    await this.teamsService.delete(org.name, team.name);
  }
}
