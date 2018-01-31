import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { _, responseOn } from '../../common';
import { ResponseTimeMiddlewareOptions } from './response-time-options.interface';

const getHeaderName = _.defaultTo<string, string>('X-Response-Time');
const getSuffix = _.defaultTo<boolean, boolean>(false);

@Middleware()
export class ResponseTimeMiddleware implements NestMiddleware {
  static options: ResponseTimeMiddlewareOptions = {};

  static withOptions(options: ResponseTimeMiddlewareOptions = {}) {
    this.options = options;
    return ResponseTimeMiddleware;
  }

  resolve(): ExpressMiddleware {
    const headerName = getHeaderName(ResponseTimeMiddleware.options.headerName);
    const suffix = getSuffix(ResponseTimeMiddleware.options.suffix);

    return (request: Request, response: Response, next: NextFunction) => {
      const startAt = process.hrtime();

      responseOn.send(response, () => {
        const diff = process.hrtime(startAt);
        const time = diff[0] * 1e3 + diff[1] * 1e-6;

        response.setHeader(headerName, time.toFixed() + (suffix ? 'ms' : ''));
      });

      responseOn.finish(response, () => {
        const diff = process.hrtime(startAt);
        const time = diff[0] * 1e3 + diff[1] * 1e-6;
      });

      next();
    };
  }
}
