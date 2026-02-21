const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const User = require('../model/user');

const TEST_DB_URI = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/bootcomp_test';

jest.setTimeout(20000);

describe('Auth and protected routes', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_ci_only';
    process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
    process.env.JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || '30';
    try {
      await mongoose.connect(TEST_DB_URI, { serverSelectionTimeoutMS: 5000 });
    } catch (error) {
      throw new Error(
        `Could not connect to test MongoDB at ${TEST_DB_URI}. Start MongoDB and retry. Original error: ${error.message}`
      );
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  });

  it('registers a user and returns a token', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'secret123',
      role: 'publisher'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.token).toBe('string');
  });

  it('returns unauthorized for protected route without token', async () => {
    const res = await request(app).get('/api/v1/bootcamps');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('allows access to protected route with valid token', async () => {
    const registerRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Auth User',
      email: 'auth.user@example.com',
      password: 'secret123',
      role: 'publisher'
    });

    const token = registerRes.body.token;

    const res = await request(app)
      .get('/api/v1/bootcamps')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
