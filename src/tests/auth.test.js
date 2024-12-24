import request from 'supertest';
import { describe, it, expect } from 'vitest';

import app from '../app.js';
import prisma from '../lib/prisma.js';

describe('Authentication', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'testpass123',
  };

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const response = await request(app).post('/api/auth/register').send(testUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', testUser.email);
  });

  it('should login existing user', async () => {
    const response = await request(app).post('/api/auth/login').send(testUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', testUser.email);
  });

  it('should not login with wrong password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpass',
    });

    expect(response.status).toBe(401);
  });
});
