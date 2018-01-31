import { ReflectMetadata } from '@nestjs/common';

import { REQUIRED_PERMISSIONS_METADATA_KEY } from '../constants';
import { Permission } from '../enums';

export const RequiredPermissions = (...permissions: Permission[]) =>
  ReflectMetadata(REQUIRED_PERMISSIONS_METADATA_KEY, permissions);
