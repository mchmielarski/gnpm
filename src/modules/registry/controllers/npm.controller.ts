import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';

import { AuthRequired, CurrentUser } from '../decorators';
import { User } from '../entities';
import { UsersExceptionsFilter } from '../filters';
import { AuthGuard } from '../guards';
import { TokensService } from '../services';

@UseFilters(new UsersExceptionsFilter())
@UseGuards(AuthGuard)
@Controller('-/npm/v1')
export class NpmController {
  constructor(
    private readonly tokensService: TokensService
  ) {}

  @AuthRequired()
  @Get('tokens')
  async tokens(@CurrentUser() user: User) {
    return {
      object: await this.tokensService.findForUser(user.id)
    };
  }
}
