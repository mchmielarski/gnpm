import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { OrgNotFoundException } from '../exceptions';

@Guard()
export class OrgExistsGuard implements CanActivate {
  canActivate(request: Request & { org?: any }, context: ExecutionContext): boolean {
    if (!request.org) {
      throw new OrgNotFoundException();
    }

    return true;
  }
}
