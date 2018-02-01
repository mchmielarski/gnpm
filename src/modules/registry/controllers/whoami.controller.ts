import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';

import { RequiredPermissions, CurrentUser } from '../decorators';
import { User } from '../entities';
import { Permission } from '../enums';
import { UsersExceptionsFilter } from '../filters';
import { PermissionsGuard } from '../guards';

@UseFilters(new UsersExceptionsFilter())
@UseGuards(PermissionsGuard)
@Controller('-/whoami')
export class WhoAmIController {
  @Get()
  @RequiredPermissions(Permission.USER)
  whoami(@CurrentUser() user: User) {
    return {
      username: user.name
    };
  }
}
