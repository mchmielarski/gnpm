import { UnauthorizedException as UnauthorizedBaseException } from '@nestjs/common';

export class UnauthorizedException extends UnauthorizedBaseException {
  constructor() {
    super({ ok: false });
  }
}
