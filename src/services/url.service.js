import { nanoid } from 'nanoid';

import logger from '../config/logger.js';
import { redis } from '../config/redis.js';
import { UrlRepository } from '../repositories/url.repository.js';

export class UrlService {
  static async createShortUrl(userId, { longUrl, customAlias, topic }) {
    const alias = customAlias || nanoid(8);

    try {
      const existingUrl = await UrlRepository.findByAlias(alias);
      if (existingUrl) {
        throw new Error('Alias already taken');
      }

      const url = await UrlRepository.create({
        userId,
        alias,
        longUrl,
        topic,
      });

      await redis.set(`url:${alias}`, longUrl, 'EX', 86400);

      return {
        shortUrl: `${process.env.BASE_URL}/${alias}`,
        createdAt: url.createdAt,
      };
    } catch (error) {
      logger.error('Error creating short URL:', error);
      throw error;
    }
  }

  static async getLongUrl(alias) {
    try {
      let longUrl = await redis.get(`url:${alias}`);

      if (!longUrl) {
        const url = await UrlRepository.findByAlias(alias);
        if (!url) {
          throw new Error('URL not found');
        }

        longUrl = url.longUrl;
        await redis.set(`url:${alias}`, longUrl, 'EX', 86400);
      }

      return longUrl;
    } catch (error) {
      logger.error('Error getting long URL:', error);
      throw error;
    }
  }
}
