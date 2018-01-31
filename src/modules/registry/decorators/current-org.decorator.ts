import { createRouteParamDecorator } from '@nestjs/common';

export const CurrentOrg = createRouteParamDecorator((data, request) => request.org);
