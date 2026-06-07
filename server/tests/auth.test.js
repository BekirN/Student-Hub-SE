const request = require('supertest');
const express = require('express');
process.env.RESEND_API_KEY = 'test_dummy_key';
process.env.JWT_SECRET = 'test_secret';
process.env.DATABASE_URL = 'postgresql://test';
// Mora biti PRIJE svih importa
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'test' })
    }
  }))
}));

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: { upload: jest.fn() }
  }
}));

jest.mock('../prisma/client', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}));

const prisma = require('../prisma/client');
const app = express();
app.use(express.json());
app.use('/api/auth', require('../routes/auth'));

describe('Auth Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /register - should fail if email missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: 'test123', firstName: 'Test', lastName: 'User' });
    expect(res.status).toBe(400);
  });

  test('POST /register - should fail if password missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', firstName: 'Test', lastName: 'User' });
    expect(res.status).toBe(400);
  });

  test('POST /login - should fail with no credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
  });

  test('POST /login - should fail if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nouser@test.com', password: 'pass123' });
    expect(res.status).toBe(400);
  });

  test('GET /me - should fail without token', async () => {
    const res = await request(app)
      .get('/api/auth/me');
    expect(res.status).toBe(401);
  });

});