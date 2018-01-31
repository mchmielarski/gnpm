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

import { AuthRequired, CurrentOrg, RequiredPermissions } from '../decorators';
import { OrgMemberCreateOrUpdateDTO, OrgMemberDeleteDTO } from '../dto';
import { Org } from '../entities';
import { Permission } from '../enums';
import { OrgNotFoundException, UserNotFoundException } from '../exceptions';
import { UsersExceptionsFilter } from '../filters';
import { AuthGuard, OrgExistsGuard, PermissionsGuard } from '../guards';
import { OrgMembersService, UsersService } from '../services';

@UseFilters(new UsersExceptionsFilter())
@UseGuards(AuthGuard, OrgExistsGuard, PermissionsGuard)
@Controller('-/org/:org/user')
export class OrgMembersController {
  constructor(
    private readonly orgMembersService: OrgMembersService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  @RequiredPermissions(Permission.ORG_MEMBER)
  async list(@CurrentOrg() org: Org) {
    const members = await this.orgMembersService.find(org.name);

    return members.reduce(
      (aggr, member) => ({
        [member.user.name]: member.role,
        ...aggr
      }),
      {}
    );
  }

  @Put()
  @RequiredPermissions(Permission.ORG_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdate(@CurrentOrg() org: Org, @Body() memberData: OrgMemberCreateOrUpdateDTO) {
    await this.ensureThatUserExists(memberData.user);
    await this.orgMembersService.save(org.name, memberData.user, memberData.role);

    const size = await this.orgMembersService.count(org.name);

    return {
      org: {
        name: org.name,
        size
      },
      ...memberData
    };
  }

  @Delete()
  @RequiredPermissions(Permission.ORG_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentOrg() org: Org, @Body() memberData: OrgMemberDeleteDTO) {
    await this.ensureThatUserExists(memberData.user);
    await this.ensureThatUserIsMember(org.name, memberData.user);
    await this.orgMembersService.delete(org.name, memberData.user);
  }

  private async ensureThatUserIsMember(orgName: string, userName: string) {
    if (!await this.orgMembersService.isMember(orgName, userName)) {
      throw new UserNotFoundException();
    }
  }

  private async ensureThatUserExists(userName: string) {
    if (!await this.usersService.exists(userName)) {
      throw new UserNotFoundException();
    }
  }
}
