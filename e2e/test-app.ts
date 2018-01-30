import * as express from 'express';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app/app.module';

export class TestApp {
  token: string;
  id: string;

  static async create() {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    const server = express();
    const app = module.createNestApplication(server);
    await app.init();

    const testApp = new TestApp(server, app);

    await testApp.resetDatabase();

    return testApp;
  }

  constructor(
    public readonly server: express.Application,
    private readonly app: INestApplication
  ) {}

  dropDatabase() {
    return getConnection().dropDatabase();
  }

  createDatabase() {
    return getConnection().synchronize();
  }

  async login() {
    this.id = 'user_' + Date.now();
    await request(this.server)
      .put(`/-/user/org.couchdb.user:${this.id}`)
      .send({
        _id: this.id,
        name: this.id,
        password: '111111',
        email: `${this.id}@email.com`
      })
      .expect(response => {
        this.token = response.body.token;
      });
  }

  async logout() {
    await request(this.server)
      .delete(`/-/user/token/${this.token}`)
      .set('authorization', `Bearer ${this.token}`)
      .expect(() => {
        this.token = null;
      });
  }

  async resetDatabase() {
    await this.dropDatabase();
    await this.createDatabase();
  }

  destroy() {
    getConnection().close();
    this.app.close();
  }
}
