import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config';
import logger from './utils/logger';

// Import routes
import authRoutes from './api/routes/auth';
import jobRoutes from './api/routes/jobs';
import userRoutes from './api/routes/users';
import projectRoutes from './api/routes/projects';

const app: Express = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: config.corsOrigin.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Compression
app.use(compression());

// Logging
if (config.env !== 'test') {
  app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg) } }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API v1 routes
app.use(`${config.apiPrefix}/${config.apiVersion}/auth`, authRoutes);
app.use(`${config.apiPrefix}/${config.apiVersion}/jobs`, jobRoutes);
app.use(`${config.apiPrefix}/${config.apiVersion}/users`, userRoutes);
app.use(`${config.apiPrefix}/${config.apiVersion}/projects`, projectRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.path} not found`,
    statusCode: 404,
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    statusCode,
    ...(config.env === 'development' && { stack: err.stack }),
  });
});

export default app;
