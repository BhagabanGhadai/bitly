import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.type === 'validation') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Something went wrong!' });
};
