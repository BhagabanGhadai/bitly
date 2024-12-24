import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import app from '../app.js';
import { redis } from '../config/redis.js';
import prisma from '../lib/prisma.js';
import { AuthService } from '../services/auth.service.js';

describe('URL Shortener API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Create test user and get token
    const email = `test-${Date.now()}@example.com`;
    const password = 'testpass123';
    const result = await AuthService.register(email, password);
    token = result.token;
    userId = result.user.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.analytics.deleteMany({
      where: { url: { userId } },
    });
    await prisma.url.deleteMany({
      where: { userId },
    });
    await prisma.user.delete({
      where: { id: userId },
    });
    await redis.quit();
    await prisma.$disconnect();
  });

  it('should create a short URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({
        longUrl: 'https://example.com',
        topic: 'acquisition',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('shortUrl');
    expect(response.body.shortUrl).toContain(process.env.BASE_URL);
  });

  it('should not allow duplicate aliases', async () => {
    const alias = 'test123';

    // Create first URL
    await request(app).post('/api/shorten').set('Authorization', `Bearer ${token}`).send({
      longUrl: 'https://example.com',
      customAlias: alias,
    });

    // Try to create second URL with same alias
    const response = await request(app)
      .post('/api/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({
        longUrl: 'https://example.org',
        customAlias: alias,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
