import * as express from 'express';
import { getConnection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app/app.module';

export class TestApp {

  static async create() {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    const server = express();
    const app = module.createNestApplication(server);
    await app.init();

    return new TestApp(server, app);
  }

  constructor(
    public readonly server: express.Application,
    private readonly app: INestApplication
  ) {}

  destroy() {
    getConnection().close();
    this.app.close();
  }
}
