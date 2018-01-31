import * as express from 'express';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app/app.module';

export class TestApp {
  token: string;
  user: string;

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

  setAuthHeader(req, token = this.token) {
    return req.set('authorization', `Bearer ${token}`);
  }

  dropDatabase() {
    return getConnection().dropDatabase();
  }

  createDatabase() {
    return getConnection().synchronize();
  }

  async login() {
    this.user = 'user_' + Date.now();

    const response = await this.createUser({
      name: this.user,
      password: '111111',
      email: `${this.user}@email.com`
    });

    this.token = response.body.token;
  }

  async logout() {
    await request(this.server)
      .delete(`/-/user/token/${this.token}`)
      .set('authorization', `Bearer ${this.token}`);

    this.token = null;
  }

  createUser(data: { name: string; email: string; password: string }) {
    return request(this.server)
      .put(`/-/user/org.couchdb.user:${data.name}`)
      .send(data);
  }

  createOrg(data: { name: string }) {
    return request(this.server)
      .put(`/-/org`)
      .set('authorization', `Bearer ${this.token}`)
      .send(data);
  }

  addMember(orgName: string, user: string, role: string) {
    return request(this.server)
      .put(`/-/org/${orgName}/user`)
      .set('authorization', `Bearer ${this.token}`)
      .send({ user, role });
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
