import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Middleware()
export class FaviconMiddleware implements NestMiddleware {
  resolve(): ExpressMiddleware {
    return (request: Request, response: Response, next: NextFunction) => {
      if (request.path === '/favicon.ico') {
        response.status(204).end();
      } else {
        next();
      }
    };
  }
}
