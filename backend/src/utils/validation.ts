/**
 * Input Validation Utilities
 */

import { z, ZodSchema } from 'zod';
import { ValidationError } from '../types/errors';

/**
 * Validate data against a Zod schema
 */
export function validateWithSchema<T>(
  data: unknown,
  schema: ZodSchema,
  context?: string,
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
        code: e.code,
      }));
      throw new ValidationError(
        context || 'Validation failed',
        { errors: details },
      );
    }
    throw error;
  }
}

/**
 * Common validation schemas
 */
export const schemas = {
  // Job creation schema
  createJob: z.object({
    type: z.enum([
      'image_generation',
      'video_generation',
      'audio_generation',
      'text_to_speech',
      'text_generation',
      'character_generation',
      'asset_3d_generation',
      'game_creation',
      'game_build',
      'animation_generation',
    ]),
    input: z.record(z.any()),
    priority: z.enum(['low', 'normal', 'high']).optional(),
    webhookUrl: z.string().url().optional(),
  }),

  // User registration schema
  userRegister: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string().min(8),
  }),

  // User login schema
  userLogin: z.object({
    email: z.string().email(),
    password: z.string(),
  }),

  // Project creation schema
  createProject: z.object({
    name: z.string().min(1).max(255),
    type: z.enum([
      'image_collection',
      'video_project',
      'game_project',
      'audio_project',
      'mixed_media',
    ]),
    description: z.string().optional(),
    settings: z.object({
      isPublic: z.boolean().optional(),
      allowComments: z.boolean().optional(),
      allowSharing: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
    }).optional(),
  }),

  // Game project schema
  createGameProject: z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    config: z.object({
      engine: z.enum(['unity', 'unreal', 'godot', 'babylon_js', 'three_js']),
      targetPlatforms: z.array(z.enum(['ios', 'android', 'web', 'desktop'])),
      dimensions: z.object({
        width: z.number().positive(),
        height: z.number().positive(),
      }).optional(),
    }),
  }),
};

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  feedback: string[];
} {
  const feedback: string[] = [];

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    feedback.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    valid: feedback.length === 0,
    feedback,
  };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>"']/g, '') // Remove potentially dangerous characters
    .substring(0, 10000); // Limit length
}
