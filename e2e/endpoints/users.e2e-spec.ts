import * as request from 'supertest';

import { TestApp } from '../test-app';
import * as fixtures from '../fixtures';

describe('/-/user', () => {
  let app: TestApp;
  let token: string;

  before(async () => {
    app = await TestApp.create();
  });

  after(() => {
    app.destroy();
  });

  describe('/org.couchdb.user:[user]', () => {
    describe('[PUT]', () => {
      it('should return 401 if wrong credentials', () => {
        return request(app.server)
          .put('/-/user/org.couchdb.user:user')
          .send(fixtures.userWithoutEmail)
          .expect(401);
      });

      it('should create user if email is in request', () => {
        return request(app.server)
          .put('/-/user/org.couchdb.user:user')
          .send(fixtures.userWithEmail)
          .expect(200)
          .expect(response => {
            if (!('ok' in response.body)) throw new Error('Missing ok key in response');
            if (!('token' in response.body)) throw new Error('Missing token key in response');
            if (!('key' in response.body)) throw new Error('Missing key key in response');
          });
      });

      it('should login user', () => {
        return request(app.server)
          .put('/-/user/org.couchdb.user:user')
          .send(fixtures.userWithoutEmail)
          .expect(200)
          .expect(response => {
            if (!('ok' in response.body)) throw new Error('Missing ok key in response');
            if (!('token' in response.body)) throw new Error('Missing token key in response');
            if (!('key' in response.body)) throw new Error('Missing key key in response');

            token = response.body.token;
          });
      });
    });
  });

  describe('/token/[token]', () => {
    describe('[DELETE]', () => {
      it('Should return 401 if user not authorized', () => {
        return request(app.server)
          .delete('/-/user/token/token')
          .expect(401);
      });

      it('Should return 404 if token does not exist', () => {
        return request(app.server)
          .delete('/-/user/token/token')
          .set('authorization', `Bearer ${token}`)
          .expect(404);
      });

      it('Should return 204 after logout', () => {
        return request(app.server)
          .delete(`/-/user/token/${token}`)
          .set('authorization', `Bearer ${token}`)
          .expect(204);
      });
    });
  });
});
