import { createRouteParamDecorator } from '@nestjs/common';

export const CurrentTeam = createRouteParamDecorator((data, request) => request.team);
