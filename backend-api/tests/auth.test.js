const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

// Mocking dependencies
jest.mock('../db', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({ name: 'Test Farmer' }) })),
        set: jest.fn(() => Promise.resolve())
      })),
      count: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ data: () => ({ count: 10 }) }))
      }))
    }))
  })),
  admin: {
    firestore: {
      FieldValue: {
        serverTimestamp: jest.fn(() => 'mock-timestamp')
      }
    }
  }
}));

jest.mock('../middlewares/authMiddleware', () => (req, res, next) => {
  req.user = { uid: 'test-uid', email: 'test@example.com' };
  next();
});

jest.mock('../middlewares/rateLimiter', () => ({
  apiLimiter: (req, res, next) => next(),
  authLimiter: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  test('POST /api/auth/signup - Success', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'John Doe', village: 'Green Valley', phone: '+919876543210' });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Signup successful');
    expect(response.body.farmer.name).toBe('John Doe');
  });

  test('POST /api/auth/signup - Missing Fields', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'John Doe' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Name, village, and phone are required');
  });

  test('GET /api/auth/me - Success', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.statusCode).toBe(200);
    expect(response.body.farmer.name).toBe('Test Farmer');
  });

  test('GET /api/auth/stats - Success', async () => {
    const response = await request(app).get('/api/auth/stats');

    expect(response.statusCode).toBe(200);
    expect(response.body.total_farmers).toBe(10);
  });
});
