import { ReflectMetadata } from '@nestjs/common';

import { AUTH_REQUIRED_METADATA_KEY } from '../constants';

export const AuthRequired = () => ReflectMetadata(AUTH_REQUIRED_METADATA_KEY, true);
