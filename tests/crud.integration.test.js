const request = require('supertest');
const mongoose = require('mongoose');

jest.mock('../utilts/geocoder', () => ({
  geocode: jest.fn(async () => [
    {
      longitude: -74.006,
      latitude: 40.7128,
      formattedAddress: 'New York, NY, USA',
      streetName: 'Broadway',
      stateCode: 'NY',
      zipcode: '10001',
      countryCode: 'us'
    }
  ])
}));

const app = require('../app');
const User = require('../model/user');
const Bootcamp = require('../model/model');
const Course = require('../model/courses');

const TEST_DB_URI = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/bootcomp_test';

jest.setTimeout(20000);

const registerAndGetToken = async (email = 'crud.user@example.com') => {
  const res = await request(app).post('/api/v1/auth/register').send({
    name: 'CRUD User',
    email,
    password: 'secret123',
    role: 'publisher'
  });
  return res.body.token;
};

describe('Bootcamp and course CRUD', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_ci_only';
    process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
    process.env.JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || '30';
    process.env.FILE_UPLOAD_PATH = process.env.FILE_UPLOAD_PATH || './public/uploads';
    process.env.MAX_FILE_UPLOAD = process.env.MAX_FILE_UPLOAD || '100000';

    try {
      await mongoose.connect(TEST_DB_URI, { serverSelectionTimeoutMS: 5000 });
    } catch (error) {
      throw new Error(
        `Could not connect to test MongoDB at ${TEST_DB_URI}. Start MongoDB and retry. Original error: ${error.message}`
      );
    }
  });

  beforeEach(async () => {
    await Course.deleteMany({});
    await Bootcamp.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  });

  it('performs bootcamp CRUD flow', async () => {
    const token = await registerAndGetToken('bootcamp.user@example.com');

    const createRes = await request(app)
      .post('/api/v1/bootcamps')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Bootcamp',
        description: 'Coding bootcamp in new york',
        address: 'New York, NY',
        careers: ['Web Development']
      });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.success).toBe(true);
    const bootcampId = createRes.body.data._id;

    const listRes = await request(app)
      .get('/api/v1/bootcamps')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.count).toBe(1);

    const updateRes = await request(app)
      .put(`/api/v1/bootcamps/${bootcampId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'updated description' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.success).toBe(true);

    const deleteRes = await request(app)
      .delete(`/api/v1/bootcamps/${bootcampId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });

  it('performs course CRUD flow', async () => {
    const token = await registerAndGetToken('course.user@example.com');

    const bootcampRes = await request(app)
      .post('/api/v1/bootcamps')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Course Bootcamp',
        description: 'Bootcamp for testing courses',
        address: 'New York, NY',
        careers: ['Web Development']
      });

    const bootcampId = bootcampRes.body.data._id;

    const createCourseRes = await request(app)
      .post(`/api/v1/bootcamps/${bootcampId}/courses`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Node API',
        description: 'REST APIs with Express',
        weeks: '6',
        tuition: 1200,
        minimumSkill: 'beginner',
        scholarshipAvailable: true
      });

    expect(createCourseRes.statusCode).toBe(200);
    expect(createCourseRes.body.success).toBe(true);
    const courseId = createCourseRes.body.data._id;

    const getCourseRes = await request(app).get(`/api/v1/courses/${courseId}`);
    expect(getCourseRes.statusCode).toBe(200);
    expect(getCourseRes.body.data._id).toBe(courseId);

    const updateCourseRes = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ tuition: 1500 });

    expect(updateCourseRes.statusCode).toBe(200);
    expect(updateCourseRes.body.data.tuition).toBe(1500);

    const deleteCourseRes = await request(app)
      .delete(`/api/v1/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteCourseRes.statusCode).toBe(200);
    expect(deleteCourseRes.body.success).toBe(true);

    const listCoursesRes = await request(app).get('/api/v1/courses');
    expect(listCoursesRes.statusCode).toBe(200);
    expect(listCoursesRes.body.count).toBe(0);
  });
});
