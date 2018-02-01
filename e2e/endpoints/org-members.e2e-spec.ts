import * as request from 'supertest';

import { TestApp } from '../test-app';
import * as fixtures from '../fixtures';

describe('/-/org/[org]/user', () => {
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
  });

  afterEach(async () => {
    await app.logout();
    await app.resetDatabase();
  });

  describe('[GET]', () => {
    it('should return lists of members', async () => {
      return request(app.server)
        .get('/-/org/test/user')
        .set('authorization', `bearer ${app.token}`)
        .expect(200, { [app.user]: 'owner' });
    });

    it('should return 401 if user is not logged in', async () => {
      return request(app.server)
        .get('/-/org/test/user')
        .expect(401);
    });

    it('should return 401 if user is not member', async () => {
      const user = await app.createUser();

      return request(app.server)
        .get('/-/org/test/user')
        .set('authorization', `bearer ${user.token}`)
        .expect(401);
    });
  });

  describe('[PUT]', () => {
    const checkResponse = response => {
      if (!('org' in response.body)) throw new Error('No org in response');
      if (!('name' in response.body.org)) throw new Error('No org name in response');
      if (!('size' in response.body.org)) throw new Error('No org size in response');
      if (!('user' in response.body)) throw new Error('No user in response');
      if (!('role' in response.body)) throw new Error('No role in response');
    };

    it('should add new member if added by owner', async () => {
      const user = await app.createUser();

      return request(app.server)
        .put('/-/org/test/user')
        .set('authorization', `Bearer ${app.token}`)
        .send({
          user: user.name,
          role: 'admin'
        })
        .expect(201)
        .expect(checkResponse);
    });

    it('should return 401 if added by admin', async () => {
      const user = await app.createUser();
      const admin = await app.createUser();

      await app.addMember('test', admin.name, 'admin');

      return request(app.server)
        .put('/-/org/test/user')
        .set('authorization', `bearer ${admin.token}`)
        .send({
          user: user.name,
          role: 'admin'
        })
        .expect(401);
    });

    it('should return 401 if added by developer', async () => {
      const user = await app.createUser();
      const admin = await app.createUser();

      await app.addMember('test', admin.name, 'developer');

      return request(app.server)
        .put('/-/org/test/user')
        .set('authorization', `bearer ${admin.token}`)
        .send({
          user: user.name,
          role: 'admin'
        })
        .expect(401);
    });

    it('should return 401 if user is not logged in', async () => {
      const user = await app.createUser();

      return request(app.server)
        .put('/-/org/test/user')
        .send({
          user: user.name,
          role: 'admin'
        })
        .expect(401);
    });
  });

  describe('[DELETE]', () => {
    it('should return 204 if deleted by owner', async () => {
      const user = await app.createUser();
      await app.addMember('test', user.name, 'admin');

      return request(app.server)
        .delete('/-/org/test/user')
        .set('authorization', `bearer ${app.token}`)
        .send({
          user: user.name
        })
        .expect(204);
    });

    it('should return 401 if deleted by admin', async () => {
      const user = await app.createUser();
      const admin = await app.createUser();
      await app.addMember('test', admin.name, 'admin');
      await app.addMember('test', user.name, 'developer');

      return request(app.server)
        .delete('/-/org/test/user')
        .set('authorization', `bearer ${admin.token}`)
        .send({
          user: user.name
        })
        .expect(401);
    });

    it('should return 401 if deleted by developer', async () => {
      const user = await app.createUser();
      const developer = await app.createUser();
      await app.addMember('test', developer.name, 'developer');
      await app.addMember('test', user.name, 'developer');

      return request(app.server)
        .delete('/-/org/test/user')
        .set('authorization', `bearer ${developer.token}`)
        .send({
          user: user.name
        })
        .expect(401);
    });

    it('should return 404 if try to delete not member', async () => {
      const user = await app.createUser();

      return request(app.server)
        .delete('/-/org/test/user')
        .set('authorization', `bearer ${app.token}`)
        .send({
          user: user.name
        })
        .expect(404);
    });
  });
});
