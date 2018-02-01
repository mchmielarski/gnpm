import * as request from 'supertest';

import { TestApp } from '../test-app';
import * as fixtures from '../fixtures';

describe('/-/npm/v1', () => {
  let app: TestApp;

  before(async () => {
    app = await TestApp.create();
  });

  after(() => {
    app.destroy();
  });

  describe('/tokens', () => {
    describe('[GET]', () => {
      it('should return 401 if user is not logged in', () => {
        return request(app.server)
          .get('/-/npm/v1/tokens')
          .expect(401);
      });

      it('should return list of tokens if user is logged in', async () => {
        await app.login();

        return request(app.server)
          .get('/-/npm/v1/tokens')
          .set('authorization', `Bearer ${app.token}`)
          .expect(200)
          .expect(response => {
            if (!('objects' in response.body)) throw new Error('No tokens in response');
          });
      });
    });
  });
});
