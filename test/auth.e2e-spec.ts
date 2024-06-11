import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const email = 'test@abc.com';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'P@ssw0rd' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('handles login request', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'P@ssw0rd' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;

        expect(res.headers['set-cookie']).toBeDefined();
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('should return current logged in user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'P@ssw0rd' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });

  it('should return 403 when user has not logged in', () => {
    return request(app.getHttpServer()).get('/auth/whoami').expect(403);
  });
});
