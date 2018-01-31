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

import { CurrentUser, RequiredPermissions } from '../decorators';
import { OrgCreateOrUpdateDTO } from '../dto';
import { Role, Permission } from '../enums';
import { Org, User } from '../entities';
import { OrgNotFoundException, UnauthorizedException } from '../exceptions';
import { UsersExceptionsFilter } from '../filters';
import { PermissionsGuard } from '../guards';
import { OrgMembersService, OrgsService, UsersService } from '../services';

@UseFilters(new UsersExceptionsFilter())
@UseGuards(PermissionsGuard)
@Controller('-/org')
export class OrgsController {
  constructor(
    private readonly orgsService: OrgsService,
    private readonly orgMembersService: OrgMembersService,
    private readonly usersService: UsersService
  ) {}

  @Put()
  @RequiredPermissions(Permission.USER)
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdate(@CurrentUser() user: User, @Body() orgData: OrgCreateOrUpdateDTO) {
    const orgExists = await this.orgsService.exists(orgData.name);

    if (orgExists && !await this.orgMembersService.isOwner(orgData.name, user.name)) {
      throw new UnauthorizedException();
    }

    const org = await this.orgsService.save(orgData);
    await this.orgMembersService.save(org.name, user.name, Role.OWNER);

    return org;
  }
}
