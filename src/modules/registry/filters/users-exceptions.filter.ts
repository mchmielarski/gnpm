import { ExceptionFilter, Catch } from '@nestjs/common';

import { UnauthorizedException } from '../exceptions';

@Catch(UnauthorizedException)
export class UsersExceptionsFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, response) {
    response.status(exception.getStatus()).json((exception.getResponse() as any).message);
  }
}
