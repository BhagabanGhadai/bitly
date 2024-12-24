import express from 'express';
import rateLimit from 'express-rate-limit';

import { AnalyticsService } from '../services/analytics.service.js';
import { UrlService } from '../services/url.service.js';
import { urlSchema } from '../validations/index.js';

const router = express.Router();

const createUrlLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

router.post('/', createUrlLimiter, async (req, res) => {
  try {
    const validatedData = urlSchema.parse(req.body);
    const result = await UrlService.createShortUrl(req.user.id, validatedData);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:alias', async (req, res) => {
  try {
    const { alias } = req.params;
    const longUrl = await UrlService.getLongUrl(alias);

    await AnalyticsService.logAnalytics(alias, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      referrer: req.headers.referer,
    });

    res.redirect(longUrl);
  } catch (error) {
    res.status(error.message === 'URL not found' ? 404 : 500).json({ error: error.message });
  }
});

export { router as urlRouter };
