import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_REQUIRED_METADATA_KEY } from '../constants';
import { UnauthorizedException } from '../exceptions';

@Guard()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(request, context: ExecutionContext): boolean {
    const { parent, handler } = context;
    const authRequired = this.reflector.get<string[]>(AUTH_REQUIRED_METADATA_KEY, handler);
    const user = request.user;

    if (authRequired && !user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
