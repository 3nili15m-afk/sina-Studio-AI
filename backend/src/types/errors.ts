/**
 * Error handling utilities
 */

import { AppError, ErrorCode } from './index';

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.INVALID_INPUT, message, 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: Record<string, any>) {
    super(ErrorCode.UNAUTHORIZED, message, 401, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', details?: Record<string, any>) {
    super(ErrorCode.FORBIDDEN, message, 403, details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(ErrorCode.NOT_FOUND, message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.CONFLICT, message, 409, details);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(ErrorCode.RATE_LIMIT_EXCEEDED, message, 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class ProviderError extends AppError {
  constructor(providerName: string, message: string, details?: Record<string, any>) {
    super(
      ErrorCode.PROVIDER_ERROR,
      `${providerName} provider error: ${message}`,
      503,
      { provider: providerName, ...details }
    );
    this.name = 'ProviderError';
  }
}

export class SandboxError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.SANDBOX_ERROR, message, 500, details);
    this.name = 'SandboxError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.DATABASE_ERROR, message, 500, details);
    this.name = 'DatabaseError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.STORAGE_ERROR, message, 500, details);
    this.name = 'StorageError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(serviceName: string, retryAfter?: number) {
    super(
      ErrorCode.SERVICE_UNAVAILABLE,
      `${serviceName} service is temporarily unavailable`,
      503,
      { service: serviceName, retryAfter }
    );
    this.name = 'ServiceUnavailableError';
  }
}
