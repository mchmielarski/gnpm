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

import { AuthRequired, CurrentOrg } from '../decorators';
import { OrgMemberCreateOrUpdateDTO, OrgMemberDeleteDTO } from '../dto';
import { Org } from '../entities';
import { OrgNotFoundException, UserNotFoundException } from '../exceptions';
import { UsersExceptionsFilter } from '../filters';
import { AuthGuard, OrgExistsGuard } from '../guards';
import { OrgMembersService, UsersService } from '../services';

@UseFilters(new UsersExceptionsFilter())
@UseGuards(AuthGuard, OrgExistsGuard)
@Controller('-/org/:org/user')
export class OrgMembersController {
  constructor(
    private readonly orgMembersService: OrgMembersService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  @AuthRequired()
  async list(@CurrentOrg() org: Org) {
    const members = await this.orgMembersService.findForOrg(org.name);

    return members.reduce(
      (aggr, member) => ({
        [member.user.name]: member.role,
        ...aggr
      }),
      {}
    );
  }

  @Put()
  @AuthRequired()
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdate(@CurrentOrg() org: Org, @Body() memberData: OrgMemberCreateOrUpdateDTO) {
    await this.ensureThatUserExists(memberData.user);
    await this.orgMembersService.createOrUpdate(memberData.user, org.name, memberData.role);

    const size = await this.orgMembersService.countForOrg(org.name);

    return {
      org: {
        name: org.name,
        size
      },
      ...memberData
    };
  }

  @Delete()
  @AuthRequired()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentOrg() org: Org, @Body() memberData: OrgMemberDeleteDTO) {
    await this.ensureThatUserExists(memberData.user);
    await this.orgMembersService.deleteFromOrg(memberData.user, org.name);
  }

  private async ensureThatUserExists(userName: string) {
    if (!await this.usersService.exists(userName)) {
      throw new UserNotFoundException();
    }
  }
}
