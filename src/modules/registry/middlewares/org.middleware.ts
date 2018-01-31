import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { OrgsService } from '../services';

@Middleware()
export class OrgMiddleware implements NestMiddleware {
  constructor(private readonly orgsService: OrgsService) {}

  resolve(...args: any[]): ExpressMiddleware {
    return async (request: Request, response: Response, next: NextFunction) => {
      const name = this.getOrgName(request.params);
      let org;

      if (name) {
        org = await this.orgsService.get(name);
      }

      (request as any).org = org || null;

      next();
    };
  }

  private getOrgName(params: { [key: string]: string }): string | null {
    return params.org || null;
  }
}
