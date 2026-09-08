/**
 * Project Schema and Model
 */

import { Schema, model, Document } from 'mongoose';
import { IProject, ProjectType } from '../types';

interface ProjectDocument extends IProject, Document {}

const projectSchema = new Schema<ProjectDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ProjectType),
      required: true,
    },
    description: String,
    settings: {
      isPublic: {
        type: Boolean,
        default: false,
      },
      allowComments: {
        type: Boolean,
        default: true,
      },
      allowSharing: {
        type: Boolean,
        default: true,
      },
      tags: [String],
      description: String,
    },
    assets: [String],
    jobs: [String],
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  },
);

// Indexes
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ type: 1 });

const Project = model<ProjectDocument>('Project', projectSchema);

export default Project;
export type { ProjectDocument };
