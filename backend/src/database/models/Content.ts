/**
 * Content/Asset Schema and Model
 */

import { Schema, model, Document } from 'mongoose';
import { IContent, ContentType } from '../types';

interface ContentDocument extends IContent, Document {}

const contentSchema = new Schema<ContentDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    projectId: String,
    jobId: String,
    type: {
      type: String,
      enum: Object.values(ContentType),
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    url: {
      type: String,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
      unique: true,
    },
    mimeType: String,
    size: {
      type: Number,
      required: true,
    },
    duration: Number,
    metadata: Schema.Types.Mixed,
    tags: [String],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ projectId: 1 });
contentSchema.index({ type: 1 });
contentSchema.index({ tags: 1 });

const Content = model<ContentDocument>('Content', contentSchema);

export default Content;
export type { ContentDocument };
