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

  dropDatabase() {
    return getConnection().dropDatabase();
  }

  createDatabase() {
    return getConnection().synchronize();
  }

  async login() {
    const user = await this.createUser();

    this.user = user.name;
    this.token = user.token;
  }

  async logout() {
    await request(this.server)
      .delete(`/-/user/token/${this.token}`)
      .set('authorization', `Bearer ${this.token}`);

    this.token = null;
  }

  async createUser(data?: { name: string; email: string; password: string }) {
    data = data || {
      name: 'u_' + Date.now(),
      password: '111111',
      email: `${this.user}@email.com`
    };

    const response = await request(this.server)
      .put(`/-/user/org.couchdb.user:${data.name}`)
      .send(data);

    return {
      ...data,
      token: response.body.token
    };
  }

  createOrg(name: string) {
    return request(this.server)
      .put(`/-/org`)
      .set('authorization', `Bearer ${this.token}`)
      .send({ name });
  }

  createTeam(orgName: string, name: string) {
    return request(this.server)
      .put(`/-/org/${orgName}/team`)
      .set('authorization', `Bearer ${this.token}`)
      .send({ name });
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
