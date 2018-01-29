import { ReflectMetadata } from '@nestjs/common';

import { Role } from '../enums';

export function Roles(...roles: Role[]) {
  return ReflectMetadata('roles', roles);
}
