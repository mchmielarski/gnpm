import * as request from 'supertest';

import { TestApp } from '../test-app';
import * as fixtures from '../fixtures';

describe('/-/org/[org]/team', () => {
  let app: TestApp;

  before(async () => {
    app = await TestApp.create();
  });

  after(() => {
    app.destroy();
  });

  beforeEach(async () => {
    await app.login();
    await app.createOrg('test');
    await app.createTeam('test', 'dev');
  });

  afterEach(async () => {
    await app.logout();
    await app.resetDatabase();
  });

  describe('[GET]', () => {
    it('should return lists of teams', async () => {
      return request(app.server)
        .get('/-/org/test/team')
        .set('authorization', `bearer ${app.token}`)
        .expect(200, ['test:dev']);
    });

    it('should return 401 if user is not logged in', async () => {
      return request(app.server)
        .get('/-/org/test/team')
        .expect(401);
    });

    it('should return 401 if user is not member', async () => {
      const user = await app.createUser();

      return request(app.server)
        .get('/-/org/test/team')
        .set('authorization', `bearer ${user.token}`)
        .expect(401);
    });
  });

  describe('[PUT]', () => {
    it('should add new team if added by owner', async () => {
      const user = await app.createUser();

      return request(app.server)
        .put('/-/org/test/team')
        .set('authorization', `Bearer ${app.token}`)
        .send({
          name: 'dev'
        })
        .expect(201, { name: 'dev' });
    });

    it('should add new team if added by admin', async () => {
      const admin = await app.createUser();
      await app.addMember('test', admin.name, 'admin');

      return request(app.server)
        .put('/-/org/test/team')
        .set('authorization', `Bearer ${admin.token}`)
        .send({
          name: 'dev'
        })
        .expect(201, { name: 'dev' });
    });

    it('should return 401 if added by developer', async () => {
      const developer = await app.createUser();
      await app.addMember('test', developer.name, 'developer');

      return request(app.server)
        .put('/-/org/test/team')
        .set('authorization', `bearer ${developer.token}`)
        .send({
          name: 'dev'
        })
        .expect(401);
    });

    it('should return 401 if user is not logged in', async () => {
      return request(app.server)
        .put('/-/org/test/team')
        .send({
          name: 'dev'
        })
        .expect(401);
    });
  });

  describe('[DELETE]', () => {
    it('should return 204 if deleted by owner', async () => {
      await app.createTeam('test', 'dev');

      return request(app.server)
        .delete('/-/team/test/dev')
        .set('authorization', `bearer ${app.token}`)
        .expect(204);
    });

    it('should return 204 if deleted by admin', async () => {
      const admin = await app.createUser();
      await app.addMember('test', admin.name, 'admin');
      await app.createTeam('test', 'dev');

      return request(app.server)
        .delete('/-/team/test/dev')
        .set('authorization', `bearer ${admin.token}`)
        .expect(204);
    });

    it('should return 401 if deleted by developer', async () => {
      const developer = await app.createUser();
      await app.addMember('test', developer.name, 'developer');
      await app.createTeam('test', 'dev');

      return request(app.server)
        .delete('/-/team/test/dev')
        .set('authorization', `bearer ${developer.token}`)
        .expect(401);
    });

    it('should return 401 if user is not logged in', async () => {
      await app.createTeam('test', 'dev');

      return request(app.server)
        .delete('/-/team/test/dev')
        .expect(401);
    });
  });
});
