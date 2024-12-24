import logger from '../config/logger.js';
import prisma from '../lib/prisma.js';

export class UrlRepository {
  static async findByAlias(alias) {
    try {
      const url = await prisma.url.findUnique({
        where: { alias },
      });
      return url;
    } catch (error) {
      logger.error('Error finding URL by alias:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const url = await prisma.url.create({
        data: {
          userId: data.userId,
          alias: data.alias,
          longUrl: data.longUrl,
          topic: data.topic,
        },
      });
      return url;
    } catch (error) {
      logger.error('Error creating URL:', error);
      throw error;
    }
  }

  static async findByUserIdAndTopic(userId, topic) {
    try {
      const urls = await prisma.url.findMany({
        where: {
          userId,
          topic,
        },
        include: {
          analytics: true,
        },
      });
      return urls;
    } catch (error) {
      logger.error('Error finding URLs by user and topic:', error);
      throw error;
    }
  }
}
