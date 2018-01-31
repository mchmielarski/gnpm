import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';

import { RequiredPermissions, CurrentUser } from '../decorators';
import { User } from '../entities';
import { Permission } from '../enums';
import { UsersExceptionsFilter } from '../filters';
import { PermissionsGuard } from '../guards';
import { TokensService } from '../services';

@UseFilters(new UsersExceptionsFilter())
@UseGuards(PermissionsGuard)
@Controller('-/npm/v1')
export class NpmController {
  constructor(private readonly tokensService: TokensService) {}

  @Get('tokens')
  @RequiredPermissions(Permission.USER)
  async tokens(@CurrentUser() user: User) {
    return {
      objects: await this.tokensService.findForUser(user.name)
    };
  }
}
