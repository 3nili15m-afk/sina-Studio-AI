/**
 * Middleware: Request logging and tracking
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger';

/**
 * Add request ID and logging
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = uuidv4();
  (res as any).locals = { requestId };

  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path}`, {
      requestId,
      statusCode: res.statusCode,
      duration,
      method: req.method,
      path: req.path,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}
