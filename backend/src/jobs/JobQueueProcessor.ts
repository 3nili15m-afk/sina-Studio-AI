/**
 * Job Queue Processor
 * Processes jobs using Bull queue with Redis backend
 * Integrates with Orchestrator for job execution
 */

import Queue from 'bull';
import config from '../config';
import logger from '../utils/logger';
import orchestrator from '../orchestrator/Orchestrator';

export interface JobQueueData {
  jobId: string;
  userId: string;
  type: string;
}

class JobQueueProcessor {
  private queue: Queue.Queue<JobQueueData>;

  constructor() {
    this.queue = new Queue('ai-jobs', config.redis.url);
    this.setupEventHandlers();
  }

  /**
   * Setup queue event handlers
   */
  private setupEventHandlers(): void {
    // Job processing
    this.queue.process(config.jobQueue.maxAttempts, async (job) => {
      logger.info(`[Queue] Processing job ${job.data.jobId}`);
      
      try {
        await orchestrator.executeJob(job.data.jobId);
        logger.info(`[Queue] Job ${job.data.jobId} completed`);
        return { status: 'completed' };
      } catch (error) {
        logger.error(`[Queue] Job ${job.data.jobId} failed`, error);
        throw error;
      }
    });

    // Job completed
    this.queue.on('completed', (job) => {
      logger.info(`[Queue] Job completed: ${job.data.jobId}`);
    });

    // Job failed
    this.queue.on('failed', (job, err) => {
      logger.error(`[Queue] Job failed after retries: ${job.data.jobId}`, err);
    });

    // Job error
    this.queue.on('error', (error) => {
      logger.error('[Queue] Queue error', error);
    });

    logger.info('[Queue] Job queue processor initialized');
  }

  /**
   * Enqueue a job for processing
   */
  async enqueueJob(jobId: string, userId: string, jobType: string): Promise<void> {
    try {
      const job = await this.queue.add(
        { jobId, userId, type: jobType },
        {
          priority: 1, // Default priority
          attempts: config.jobQueue.maxAttempts,
          backoff: {
            type: 'exponential',
            delay: config.jobQueue.backoffDelay,
          },
          timeout: config.jobQueue.timeout,
          removeOnComplete: false, // Keep job history
        },
      );

      logger.info(`[Queue] Job ${jobId} enqueued with ID ${job.id}`);
    } catch (error) {
      logger.error(`[Queue] Failed to enqueue job ${jobId}`, error);
      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{ waiting: number; active: number; completed: number; failed: number }> {
    const counts = await this.queue.getJobCounts();
    return {
      waiting: counts.waiting,
      active: counts.active,
      completed: counts.completed,
      failed: counts.failed,
    };
  }

  /**
   * Clean up queue (close connection)
   */
  async close(): Promise<void> {
    await this.queue.close();
    logger.info('[Queue] Job queue processor closed');
  }
}

// Create singleton instance
const jobQueueProcessor = new JobQueueProcessor();

export default jobQueueProcessor;
