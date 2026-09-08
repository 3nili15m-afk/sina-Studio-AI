/**
 * Middleware: Error handling
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import logger from '../utils/logger';

export function errorHandler(
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error('Request error', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      timestamp: new Date(),
      requestId: (res as any).locals?.requestId,
    });
    return;
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
    },
    timestamp: new Date(),
    requestId: (res as any).locals?.requestId,
  });
}
