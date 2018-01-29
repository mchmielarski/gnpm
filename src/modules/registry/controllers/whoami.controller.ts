import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';

import { AuthRequired, CurrentUser } from '../decorators';
import { User } from '../entities';
import { UsersExceptionsFilter } from '../filters';
import { AuthGuard } from '../guards';

@UseFilters(new UsersExceptionsFilter())
@UseGuards(AuthGuard)
@Controller('-/whoami')
export class WhoAmIController {
  @AuthRequired()
  @Get()
  whoami(@CurrentUser() user: User) {
    return {
      username: user.name
    };
  }
}
