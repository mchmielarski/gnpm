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
    await app.createOrg({ name: 'test' });
  });

  afterEach(async () => {
    await app.logout();
    await app.resetDatabase();
  });

  it('[GET] should return lists of members', async () => {
    let req = request(app.server)
      .get('/-/org/test/user');

    req = app.setAuthHeader(req);

    return req.expect(200, { [app.user]: 'owner' });
  });

  it('[GET] should return 401 if user is not logged in', async () => {
    return request(app.server)
      .get('/-/org/test/user')
      .expect(401);
  });

  it('[GET] should return 401 if user is not member', async () => {
    const response = await app.createUser({ name: 'u', email: 'u@email.com', password: '111111' });

    let req = request(app.server)
      .get('/-/org/test/user');

    req = app.setAuthHeader(req, response.body.token);

    return req.expect(401);
  });

  it('[PUT] should add new member if added by owner', async () => {
    await app.createUser({ name: 'u', email: 'u@email.com', password: '111111' });

    let req = request(app.server)
      .put('/-/org/test/user');

    req = app.setAuthHeader(req);

    return req.send({
        user: 'u',
        role: 'admin'
      })
      .expect(201)
      .expect(response => {
        if (!('org' in response.body)) throw new Error('No org in response');
        if (!('name' in response.body.org)) throw new Error('No org name in response');
        if (!('size' in response.body.org)) throw new Error('No org size in response');
        if (!('user' in response.body)) throw new Error('No user in response');
        if (!('role' in response.body)) throw new Error('No role in response');
      });
  });

  it('[PUT] should add new member if added by admin', async () => {
    await app.createUser({ name: 'u', email: 'u@email.com', password: '111111' });
    const result = await app.createUser({ name: 'm', email: 'm@email.com', password: '111111' });
    await app.addMember('test', 'm', 'admin');

    let req = request(app.server)
      .put('/-/org/test/user');

    req = app.setAuthHeader(req, result.body.token);

    return req.send({
        user: 'u',
        role: 'admin'
      })
      .expect(201)
      .expect(response => {
        if (!('org' in response.body)) throw new Error('No org in response');
        if (!('name' in response.body.org)) throw new Error('No org name in response');
        if (!('size' in response.body.org)) throw new Error('No org size in response');
        if (!('user' in response.body)) throw new Error('No user in response');
        if (!('role' in response.body)) throw new Error('No role in response');
      });
  });

  it('[PUT] should return 401 if user is not logged in', async () => {
    await app.createUser({ name: 'u', email: 'u@email.com', password: '111111' });

    return request(app.server)
      .put('/-/org/test/user')
      .send({
        user: 'u',
        role: 'admin'
      })
      .expect(401);
  });

  it('[PUT] should return 401 if user is not admin or owner', async () => {
    await app.createUser({ name: 'u', email: 'u@email.com', password: '111111' });
    const response = await app.createUser({ name: 'm', email: 'm@email.com', password: '111111' });
    await app.addMember('test', 'm', 'developer');

    let req = request(app.server)
      .put('/-/org/test/user');

    req = app.setAuthHeader(req, response.body.token);

    return req.send({
        user: 'u',
        role: 'admin'
      })
      .expect(401);
  });

  it('[DELETE] should return 204 if deleted by owner', async () => {
    await app.createUser({ name: 'm', email: 'm@email.com', password: '111111' });
    await app.addMember('test', 'm', 'admin');

    let req = request(app.server)
      .delete('/-/org/test/user');

    req = app.setAuthHeader(req);

    return req.send({
        user: 'm'
      })
      .expect(204);
  });

  it('[PUT] should return 204 if deleted by admin', async () => {
    await app.createUser({ name: 'u', email: 'u@email.com', password: '111111' });
    const response = await app.createUser({ name: 'm', email: 'm@email.com', password: '111111' });
    await app.addMember('test', 'm', 'admin');
    await app.addMember('test', 'u', 'developer');

    let req = request(app.server)
      .delete('/-/org/test/user');

    req = app.setAuthHeader(req, response.body.token);

    return req.send({
        user: 'u'
      })
      .expect(204);
  });

  it('[PUT] should return 401 if not deleted by owner or admin', async () => {
    await app.createUser({ name: 'u', email: 'u@email.com', password: '111111' });
    const response = await app.createUser({ name: 'm', email: 'm@email.com', password: '111111' });
    await app.addMember('test', 'm', 'developer');
    await app.addMember('test', 'u', 'developer');

    let req = request(app.server)
      .delete('/-/org/test/user');

    req = app.setAuthHeader(req, response.body.token);

    return req.send({
        user: 'u'
      })
      .expect(401);
  });

  it('[PUT] should return 404 if try to delete not member', async () => {
    await app.createUser({ name: 'u', email: 'u@email.com', password: '111111' });

    let req = request(app.server)
      .delete('/-/org/test/user');

    req = app.setAuthHeader(req);

    return req.send({
        user: 'u'
      })
      .expect(404);
  });

});
