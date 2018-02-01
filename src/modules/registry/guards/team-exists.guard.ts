import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { TeamNotFoundException } from '../exceptions';

@Guard()
export class TeamExistsGuard implements CanActivate {
  canActivate(request: Request & { team?: any }, context: ExecutionContext): boolean {
    if (!request.team) {
      throw new TeamNotFoundException();
    }

    return true;
  }
}
