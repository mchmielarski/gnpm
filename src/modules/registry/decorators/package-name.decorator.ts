import { createRouteParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { PackageNameDTO } from '../dto';

export const PackageName = createRouteParamDecorator(
  (paramsKey: string, request: Request): PackageNameDTO => {
    const full = request.params[paramsKey];
    let scope: string | null;
    let short: string | null;

    if (full.startsWith('@')) {
      const tmp = full.split('/');
      scope = tmp[0];
      short = tmp[1];
    } else {
      scope = null;
      short = null;
    }

    return { full, short, scope };
  }
);
