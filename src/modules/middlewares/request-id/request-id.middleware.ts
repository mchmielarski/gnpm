import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as uuid from 'uuid';

import { _ } from '../../common';
import { RequestIdMiddlewareOptions } from './request-id-options.interface';

const getUUIDVersion = _.defaultTo<'v4', 'v1' | 'v4'>('v4');
const getAttributeName = _.defaultTo<string, string>('id');
const getHeaderName = _.defaultTo<string, string>('X-Request-Id');
const getSetHeader = _.somePass([_.eq(undefined), _.toBoolean]);
const generatetId = (uuidVersion: 'v1' | 'v4') => (_.eq('v1', uuidVersion) ? uuid.v1() : uuid.v4());

@Middleware()
export class RequestIdMiddleware implements NestMiddleware {
  static options: RequestIdMiddlewareOptions = {};

  static withOptions(options: RequestIdMiddlewareOptions) {
    RequestIdMiddleware.options = options;
    return RequestIdMiddleware;
  }

  resolve(): ExpressMiddleware {
    const uuidVersion = getUUIDVersion(RequestIdMiddleware.options.uuidVersion);
    const attributeName = getAttributeName(RequestIdMiddleware.options.attributeName);
    const headerName = getHeaderName(RequestIdMiddleware.options.headerName);
    const setHeader = getSetHeader(RequestIdMiddleware.options.setHeader);

    const getId = (request: Request) => request.header(headerName) || generatetId(uuidVersion);

    return (request: Request, response: Response, next: NextFunction) => {
      const id = getId(request);

      _.set(request, 'id', id);

      if (setHeader) {
        response.setHeader(headerName, id);
      }

      next();
    };
  }
}
