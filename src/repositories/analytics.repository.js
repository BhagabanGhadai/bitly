import logger from '../config/logger.js';
import prisma from '../lib/prisma.js';

export class AnalyticsRepository {
  static async create(data) {
    try {
      const analytics = await prisma.analytics.create({
        data: {
          urlAlias: data.urlAlias,
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
          referrer: data.referrer,
        },
      });
      return analytics;
    } catch (error) {
      logger.error('Error creating analytics:', error);
      throw error;
    }
  }

  static async findByAlias(alias) {
    try {
      const analytics = await prisma.analytics.findMany({
        where: {
          urlAlias: alias,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return analytics;
    } catch (error) {
      logger.error('Error finding analytics by alias:', error);
      throw error;
    }
  }

  static async findByAliases(aliases) {
    try {
      const analytics = await prisma.analytics.findMany({
        where: {
          urlAlias: {
            in: aliases,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return analytics;
    } catch (error) {
      logger.error('Error finding analytics by aliases:', error);
      throw error;
    }
  }
}
