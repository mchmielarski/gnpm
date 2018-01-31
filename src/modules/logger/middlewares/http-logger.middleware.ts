import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';

import { responseOn } from '../../common';
import { LoggerService } from '../services/logger.service';

@Middleware()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  resolve(): ExpressMiddleware {
    return (request: Request, response: Response, next: NextFunction) => {
      const requestId = (request as any).id;
      let bytesIn = 0;
      let bytesOut = 0;

      this.logger.info({
        request,
        requestId,
        ip: request.ip,
        event: 'http:request:received'
      });

      request.on('data', chunk => (bytesIn += chunk.length));

      const done = (event: string) => {
        disposeOnFinish();
        disposeOnClose();

        bytesOut = bytesOut || (response.getHeader('content-length') as number) || 0;

        this.logger.info({
          request: {
            method: request.method,
            url: request.url
          },
          requestId,
          status: response.statusCode,
          bytes: {
            in: bytesIn,
            out: bytesOut
          },
          event: `http:response:${event}`
        });
      };

      responseOn.write(response, buf => {
        bytesOut += buf.length;
      });

      const disposeOnClose = responseOn.close(response, () => {
        done('canceled');
      });

      const disposeOnFinish = responseOn.finish(response, () => {
        done('sent');
      });

      next();
    };
  }
}
