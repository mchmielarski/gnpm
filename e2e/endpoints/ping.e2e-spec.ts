import * as request from 'supertest';

import { TestApp } from '../test-app';

describe('/-/ping', () => {
  let app: TestApp;

  before(async () => {
    app = await TestApp.create();
  });

  after(() => {
    app.destroy();
  });

  it('[GET] should return status code 200 and empty object', () => {
    return request(app.server)
      .get('/-/ping')
      .expect(200)
      .expect({});
  });
});
