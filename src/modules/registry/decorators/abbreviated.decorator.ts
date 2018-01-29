import { createRouteParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Abbreviated = createRouteParamDecorator((data, request: Request) => {
  const acceptHeader = request.header('accept');

  if (!acceptHeader) {
    return false;
  }

  return acceptHeader.indexOf('application/vnd.npm.install-v1+json') > -1;
});
