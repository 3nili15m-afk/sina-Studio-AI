/**
 * Job Schema and Model
 */

import { Schema, model, Document } from 'mongoose';
import { IJob, JobStatus, JobType, JobPriority } from '../types';

interface JobDocument extends IJob, Document {}

const jobSchema = new Schema<JobDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(JobType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.PENDING,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(JobPriority),
      default: JobPriority.NORMAL,
    },
    input: {
      type: Schema.Types.Mixed,
      required: true,
    },
    output: Schema.Types.Mixed,
    result: {
      contentUrl: String,
      contentId: String,
      format: String,
      size: Number,
      duration: Number,
      metadata: Schema.Types.Mixed,
    },
    error: {
      code: String,
      message: String,
      details: Schema.Types.Mixed,
      stack: String,
    },
    progress: {
      percentage: Number,
      stage: String,
      estimatedTimeRemaining: Number,
      details: Schema.Types.Mixed,
    },
    metadata: {
      requestedAt: {
        type: Date,
        default: () => new Date(),
      },
      startedAt: Date,
      completedAt: Date,
      executionTime: Number,
      retryCount: {
        type: Number,
        default: 0,
      },
      maxRetries: {
        type: Number,
        default: 3,
      },
      cost: Number,
      provider: String,
    },
    webhookUrl: String,
  },
  {
    timestamps: true,
  },
);

// Indexes for query performance
jobSchema.index({ userId: 1, status: 1 });
jobSchema.index({ type: 1, status: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ 'metadata.completedAt': 1 });

const Job = model<JobDocument>('Job', jobSchema);

export default Job;
export type { JobDocument };
