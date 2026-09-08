/**
 * Central Orchestrator - Coordinates job execution and multi-step workflows
 */

import { v4 as uuidv4 } from 'uuid';
import {
  IJob,
  JobStatus,
  JobType,
  JobPriority,
  UserPreferences,
} from '../types';
import { IProvider } from '../providers/interfaces/IProvider';
import { Router } from './Router';
import { Job as JobModel } from '../database/models';
import logger from '../utils/logger';
import { AppError, ValidationError } from '../types/errors';

export interface OrchestratorRequest {
  userId: string;
  jobType: JobType;
  input: Record<string, any>;
  priority?: JobPriority;
  webhookUrl?: string;
  userPreferences?: UserPreferences;
}

export interface OrchestratorResponse {
  jobId: string;
  status: JobStatus;
  createdAt: Date;
}

/**
 * Central Orchestrator
 * Responsible for:
 * - Job creation and lifecycle management
 * - Provider routing and selection
 * - Workflow coordination
 * - Job persistence
 * - Error handling and retries
 */
export class Orchestrator {
  private router: Router;
  private providers: Map<string, IProvider> = new Map();

  constructor() {
    this.router = new Router();
  }

  /**
   * Register available providers
   */
  registerProvider(provider: IProvider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
    logger.info(`Orchestrator registered provider: ${provider.name}`);
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): IProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Create and enqueue a job
   * This is the main entry point for job processing
   */
  async createJob(request: OrchestratorRequest): Promise<OrchestratorResponse> {
    try {
      logger.info(`Creating job for user ${request.userId} of type ${request.jobType}`);

      // Validate input
      if (!request.userId) {
        throw new ValidationError('User ID is required');
      }
      if (!request.jobType) {
        throw new ValidationError('Job type is required');
      }
      if (!request.input || Object.keys(request.input).length === 0) {
        throw new ValidationError('Job input is required');
      }

      // Route to appropriate provider
      const availableProviders = this.getAvailableProviders();
      if (availableProviders.length === 0) {
        throw new AppError(
          'NO_PROVIDERS',
          'No AI providers are currently available',
          503,
        );
      }

      const routingDecision = await this.router.route(
        request.jobType,
        availableProviders,
        request.userPreferences,
      );

      logger.info(
        `Routed job to provider: ${routingDecision.providerName}`,
        { jobType: request.jobType, reasoning: routingDecision.reasoning },
      );

      // Create job in database
      const jobId = uuidv4();
      const jobData: Omit<IJob, 'id'> = {
        userId: request.userId,
        type: request.jobType,
        status: JobStatus.PENDING,
        priority: request.priority || JobPriority.NORMAL,
        input: request.input,
        metadata: {
          requestedAt: new Date(),
          retryCount: 0,
          maxRetries: 3,
          provider: routingDecision.providerName,
        },
        webhookUrl: request.webhookUrl,
      };

      const job = new JobModel({
        _id: jobId,
        ...jobData,
      });

      await job.save();
      logger.info(`Job created: ${jobId}`);

      return {
        jobId,
        status: JobStatus.PENDING,
        createdAt: new Date(),
      };
    } catch (error) {
      logger.error('Job creation failed', error);
      throw error;
    }
  }

  /**
   * Execute job using selected provider
   */
  async executeJob(jobId: string): Promise<void> {
    try {
      logger.info(`Executing job: ${jobId}`);

      // Fetch job from database
      const job = await JobModel.findById(jobId);
      if (!job) {
        throw new AppError('JOB_NOT_FOUND', `Job ${jobId} not found`, 404);
      }

      // Validate provider is available
      const providerName = job.metadata?.provider;
      const provider = this.providers.get(providerName?.toLowerCase() || '');
      if (!provider) {
        throw new AppError(
          'PROVIDER_NOT_FOUND',
          `Provider ${providerName} not found`,
          503,
        );
      }

      // Update job status
      job.status = JobStatus.PROCESSING;
      job.metadata.startedAt = new Date();
      await job.save();

      try {
        // Execute with provider
        const result = await provider.executeJob(job as any);

        // Update job with result
        job.status = JobStatus.COMPLETED;
        job.output = result.output;
        job.result = {
          contentUrl: result.output?.imageUrl || result.output?.videoUrl || '',
          format: result.output?.format,
        };
        job.metadata.completedAt = new Date();
        job.metadata.executionTime = job.metadata.completedAt.getTime() - 
          (job.metadata.startedAt?.getTime() || 0);
        await job.save();

        logger.info(`Job completed successfully: ${jobId}`);

        // Trigger webhook if configured
        if (job.webhookUrl) {
          this.triggerWebhook(job.webhookUrl, job as any).catch((err) =>
            logger.error('Webhook delivery failed', err),
          );
        }
      } catch (executionError) {
        logger.error(`Job execution failed: ${jobId}`, executionError);

        // Handle retry logic
        const shouldRetry =
          (job.metadata.retryCount || 0) < (job.metadata.maxRetries || 3);

        if (shouldRetry) {
          job.status = JobStatus.QUEUED; // Re-queue for retry
          job.metadata.retryCount = (job.metadata.retryCount || 0) + 1;
          await job.save();
          logger.info(
            `Job queued for retry ${job.metadata.retryCount}/${job.metadata.maxRetries}: ${jobId}`,
          );
        } else {
          job.status = JobStatus.FAILED;
          job.error = {
            code: 'EXECUTION_ERROR',
            message:
              executionError instanceof Error
                ? executionError.message
                : 'Unknown error',
            stack: executionError instanceof Error ? executionError.stack : undefined,
          };
          await job.save();
          logger.error(`Job failed permanently: ${jobId}`);
        }
      }
    } catch (error) {
      logger.error(`Orchestrator job execution error: ${jobId}`, error);
      throw error;
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<IJob> {
    const job = await JobModel.findById(jobId);
    if (!job) {
      throw new AppError('JOB_NOT_FOUND', `Job ${jobId} not found`, 404);
    }
    return job as IJob;
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<void> {
    const job = await JobModel.findById(jobId);
    if (!job) {
      throw new AppError('JOB_NOT_FOUND', `Job ${jobId} not found`, 404);
    }

    if ([JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED].includes(job.status)) {
      throw new AppError(
        'JOB_NOT_CANCELLABLE',
        `Cannot cancel job with status ${job.status}`,
        400,
      );
    }

    job.status = JobStatus.CANCELLED;
    await job.save();
    logger.info(`Job cancelled: ${jobId}`);
  }

  /**
   * Trigger webhook notification
   */
  private async triggerWebhook(url: string, job: IJob): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          status: job.status,
          result: job.result,
          error: job.error,
          timestamp: new Date(),
        }),
      });

      if (!response.ok) {
        logger.warn(`Webhook returned status ${response.status} for ${url}`);
      }
    } catch (error) {
      logger.error('Webhook trigger failed', error);
    }
  }
}

// Create singleton instance
const orchestrator = new Orchestrator();

export default orchestrator;
