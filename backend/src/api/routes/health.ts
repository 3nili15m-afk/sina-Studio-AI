/**
 * Health Check & Status API Routes
 */

import { Router, Request, Response } from 'express';
import { connectDatabase, getDatabaseStatus } from '../../database/connection';
import registry from '../../providers/registry';
import logger from '../../utils/logger';

const router = Router();

/**
 * GET /api/v1/health
 * Basic health check
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    version: '1.0.0',
  });
});

/**
 * GET /api/v1/health/detailed
 * Detailed health check with service status
 */
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    const dbStatus = getDatabaseStatus();
    const providersStatus = registry.getStatus();

    const allHealthy = dbStatus.connected && 
      Object.values(providersStatus).some((p: any) => p.initialized);

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date(),
      services: {
        database: dbStatus,
        providers: providersStatus,
      },
    });
  } catch (error) {
    logger.error('Health check error', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
