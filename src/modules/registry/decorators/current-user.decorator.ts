import { createRouteParamDecorator } from '@nestjs/common';

export const CurrentUser = createRouteParamDecorator((data, request) => request.user);
