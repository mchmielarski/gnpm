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

  it('[GET] should return 401 status code if user not logged in', () => {
    return request(app.server)
      .get('/-/whoami')
      .expect(401);
  });

});
