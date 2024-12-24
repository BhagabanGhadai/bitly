import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' assert { type: 'json' };

import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { authenticate } from './middleware/authenticate.js';
import { authRouter } from './routes/auth.routes.js';
import { urlRouter } from './routes/url.routes.js';
import { analyticsRouter } from './routes/analytics.routes.js';
import { healthCheckRouter } from './routes/healthCheck.routes.js';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(morgan('combined'));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/shorten', authenticate, urlRouter);
app.use('/api/analytics', authenticate, analyticsRouter);
app.use('/api/health', healthCheckRouter);

// Error handling
app.use(errorHandler);

export default app;