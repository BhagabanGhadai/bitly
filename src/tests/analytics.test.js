import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import app from '../app.js';
import { redis } from '../config/redis.js';
import prisma from '../lib/prisma.js';
import { AuthService } from '../services/auth.service.js';

describe('Analytics', () => {
  let token;
  let userId;
  let alias;

  beforeAll(async () => {
    // Create test user
    const email = `test-${Date.now()}@example.com`;
    const result = await AuthService.register(email, 'testpass123');
    token = result.token;
    userId = result.user.id;

    // Create test URL
    const url = await prisma.url.create({
      data: {
        userId,
        alias: `test-${Date.now()}`,
        longUrl: 'https://example.com',
        topic: 'acquisition',
      },
    });
    alias = url.alias;

    // Create some test analytics
    await prisma.analytics.createMany({
      data: [
        {
          urlAlias: alias,
          userAgent: 'test-agent',
          ipAddress: '127.0.0.1',
        },
        {
          urlAlias: alias,
          userAgent: 'test-agent-2',
          ipAddress: '127.0.0.2',
        },
      ],
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.analytics.deleteMany({
      where: { urlAlias: alias },
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

  it('should get URL analytics', async () => {
    const response = await request(app)
      .get(`/api/analytics/${alias}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalClicks', 2);
    expect(response.body).toHaveProperty('uniqueClicks', 2);
    expect(response.body).toHaveProperty('clicksByDate');
  });

  it('should get topic analytics', async () => {
    const response = await request(app)
      .get('/api/analytics/topic/acquisition')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalClicks');
    expect(response.body).toHaveProperty('urls');
  });
});
