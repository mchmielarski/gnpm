import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseFilters,
  UseGuards
} from '@nestjs/common';

import { AuthRequired, CurrentUser } from '../decorators';
import { UserLoginOrCreateDTO } from '../dto';
import { User } from '../entities';
import { TokenNotFoundException, UnauthorizedException } from '../exceptions';
import { UsersExceptionsFilter } from '../filters';
import { AuthGuard } from '../guards';
import { UsersService, TokensService } from '../services';

@UseFilters(new UsersExceptionsFilter())
@UseGuards(AuthGuard)
@Controller('-/user')
export class UsersController {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService
  ) {}

  @Put('org.couchdb.user::userId')
  async logIn(@Param('userId') userId: string, @Body() userLoginOrCreateDTO: UserLoginOrCreateDTO) {
    let user = await this.usersService.get(userId);
    let justCreated = false;

    if (
      !this.usersService.isUserEntity(user) &&
      this.usersService.isUserCreateDTO(userLoginOrCreateDTO)
    ) {
      user = await this.usersService.create(userLoginOrCreateDTO);
      justCreated = true;
    }

    if (
      !this.usersService.isUserEntity(user) ||
      (!justCreated && !await user.comparePassword(userLoginOrCreateDTO.password))
    ) {
      throw new UnauthorizedException();
    }

    const token = await this.tokensService.create(user.name);

    return {
      ok: true,
      token: token.token,
      key: token.key
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @AuthRequired()
  @Delete('token/:token')
  async logout(@Param('token') token: string, @CurrentUser() user: User) {
    const tokenEntity = await this.tokensService.findOne({ token });

    if (!tokenEntity) {
      throw new TokenNotFoundException();
    }

    if (tokenEntity.user.name !== user.name) {
      throw new UnauthorizedException();
    }

    await this.tokensService.delete(tokenEntity.key);
  }
}
