import * as request from 'supertest';

import { TestApp } from '../test-app';

describe('/-/whoami', () => {
  let app: TestApp;

  before(async () => {
    app = await TestApp.create();
  });

  after(() => {
    app.destroy();
  });

  describe('[GET]', () => {
    it('should return 401 status code if user not logged in', () => {
      return request(app.server)
        .get('/-/whoami')
        .expect(401);
    });

    it('should return info about user if user logged in', async () => {
      await app.login();

      return request(app.server)
        .get('/-/whoami')
        .set('authorization', `bearer ${app.token}`)
        .expect(200)
        .expect(response => {
          if (response.body.username !== app.user) throw new Error('Invalid username in response');
        });
    });
  });
});
