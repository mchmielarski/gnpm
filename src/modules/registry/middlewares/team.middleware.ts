import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { TeamsService } from '../services';

@Middleware()
export class TeamMiddleware implements NestMiddleware {
  constructor(private readonly teamsService: TeamsService) {}

  resolve(...args: any[]): ExpressMiddleware {
    return async (request: Request, response: Response, next: NextFunction) => {
      const orgName = this.getOrgName(request.params);
      const teamName = this.getTeamName(request.params);
      let team;

      if (orgName && teamName) {
        team = await this.teamsService.get(orgName, teamName);
      }

      (request as any).team = team || null;

      next();
    };
  }

  private getOrgName(params: { [key: string]: string }): string | null {
    return params.org || null;
  }

  private getTeamName(params: { [key: string]: string }): string | null {
    return params.team || null;
  }
}
