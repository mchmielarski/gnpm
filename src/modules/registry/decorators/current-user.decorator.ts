import { createRouteParamDecorator } from '@nestjs/common';

import { getUser } from '../util';

export const CurrentUser = createRouteParamDecorator((data, request) => getUser(request));
