import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { Request } from 'express';

import { TokensService } from '../services/tokens.service';

@Middleware()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly tokens: TokensService) {}

  resolve(...args: any[]): ExpressMiddleware {
    return async (request: Request, res, next) => {
      const header = request.header('authorization');

      if (header) {
        const splittedHeader = header.split(' ');
        const token = splittedHeader[1] ? splittedHeader[1].trim() : null;

        if (token) {
          const tokenEntity = await this.tokens.findOne({ token });
          (request as any).user = tokenEntity ? tokenEntity.user : null;
        } else {
          (request as any).user = null;
        }
      }

      next();
    };
  }
}
