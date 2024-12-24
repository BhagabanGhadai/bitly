import logger from '../config/logger.js';
import { redis } from '../config/redis.js';
import { AnalyticsRepository } from '../repositories/analytics.repository.js';
import { UrlRepository } from '../repositories/url.repository.js';
import { processAnalytics, processTopicAnalytics } from '../utils/analytics.utils.js';

export class AnalyticsService {
  static async logAnalytics(alias, { userAgent, ipAddress, referrer }) {
    try {
      await AnalyticsRepository.create({
        urlAlias: alias,
        userAgent,
        ipAddress,
        referrer,
      });
    } catch (error) {
      logger.error('Error logging analytics:', error);
      throw error;
    }
  }

  static async getUrlAnalytics(alias) {
    try {
      const cachedAnalytics = await redis.get(`analytics:${alias}`);
      if (cachedAnalytics) {
        return JSON.parse(cachedAnalytics);
      }

      const clicks = await AnalyticsRepository.findByAlias(alias);
      if (!clicks || clicks.length === 0) {
        throw new Error('No analytics found');
      }

      const analytics = processAnalytics(clicks);
      await redis.set(`analytics:${alias}`, JSON.stringify(analytics), 'EX', 300);

      return analytics;
    } catch (error) {
      logger.error('Error getting URL analytics:', error);
      throw error;
    }
  }

  static async getTopicAnalytics(userId, topic) {
    try {
      const urls = await UrlRepository.findByUserIdAndTopic(userId, topic);
      if (!urls || urls.length === 0) {
        return {
          totalClicks: 0,
          uniqueClicks: 0,
          clicksByDate: [],
          urls: [],
        };
      }

      const aliases = urls.map(url => url.alias);
      const analytics = await AnalyticsRepository.findByAliases(aliases);

      return processTopicAnalytics(analytics, aliases);
    } catch (error) {
      logger.error('Error getting topic analytics:', error);
      throw error;
    }
  }
}
