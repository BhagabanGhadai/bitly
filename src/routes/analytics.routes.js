import express from 'express';

import { AnalyticsService } from '../services/analytics.service.js';

const router = express.Router();

router.get('/:alias', async (req, res) => {
  try {
    const { alias } = req.params;
    const analytics = await AnalyticsService.getUrlAnalytics(alias);
    res.json(analytics);
  } catch (error) {
    res.status(error.message === 'No analytics found' ? 404 : 500).json({ error: error.message });
  }
});

router.get('/topic/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const analytics = await AnalyticsService.getTopicAnalytics(req.user.id, topic);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as analyticsRouter };
