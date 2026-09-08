/**
 * Jobs API Routes
 */

import { Router, Request, Response } from 'express';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';
import orchestrator from '../../orchestrator/Orchestrator';
import { validateWithSchema, schemas } from '../../utils/validation';
import logger from '../../utils/logger';

const router = Router();

/**
 * POST /api/v1/jobs
 * Create a new job
 */
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = validateWithSchema(req.body, schemas.createJob);

    const response = await orchestrator.createJob({
      userId: req.user!.userId,
      jobType: validated.type as any,
      input: validated.input,
      priority: validated.priority,
      webhookUrl: validated.webhookUrl,
      userPreferences: undefined, // TODO: Load from user preferences
    });

    res.status(201).json({
      success: true,
      data: response,
      timestamp: new Date(),
      requestId: (res as any).locals?.requestId,
    });
  } catch (error) {
    logger.error('Job creation error', error);
    throw error;
  }
});

/**
 * GET /api/v1/jobs/:jobId
 * Get job status and details
 */
router.get('/:jobId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const job = await orchestrator.getJobStatus(req.params.jobId);

    // Verify user owns the job
    if (job.userId !== req.user?.userId) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this job',
        },
        timestamp: new Date(),
        requestId: (res as any).locals?.requestId,
      });
      return;
    }

    res.json({
      success: true,
      data: job,
      timestamp: new Date(),
      requestId: (res as any).locals?.requestId,
    });
  } catch (error) {
    logger.error('Job fetch error', error);
    throw error;
  }
});

/**
 * POST /api/v1/jobs/:jobId/cancel
 * Cancel a job
 */
router.post('/:jobId/cancel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Verify user owns the job
    const job = await orchestrator.getJobStatus(req.params.jobId);
    if (job.userId !== req.user?.userId) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this job',
        },
        timestamp: new Date(),
        requestId: (res as any).locals?.requestId,
      });
      return;
    }

    await orchestrator.cancelJob(req.params.jobId);

    res.json({
      success: true,
      data: { jobId: req.params.jobId, cancelled: true },
      timestamp: new Date(),
      requestId: (res as any).locals?.requestId,
    });
  } catch (error) {
    logger.error('Job cancellation error', error);
    throw error;
  }
});

export default router;
