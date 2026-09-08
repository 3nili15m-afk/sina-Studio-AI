import { z } from 'zod';

// Common validators
export const emailValidator = z.string().email('Invalid email address');

export const passwordValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit');

export const uuidValidator = z.string().uuid('Invalid UUID format');

export const urlValidator = z.string().url('Invalid URL');

// Job validators
export const jobTypeValidator = z.enum([
  'image_generation',
  'video_generation',
  'audio_generation',
  'text_to_speech',
  'game_creation',
]);

export const jobStatusValidator = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
]);

export const jobPriorityValidator = z.enum(['low', 'normal', 'high']).default('normal');

// API Validators
export const createJobValidator = z.object({
  type: jobTypeValidator,
  input: z.record(z.any()),
  priority: jobPriorityValidator,
  webhookUrl: urlValidator.optional(),
});

export const loginValidator = z.object({
  email: emailValidator,
  password: z.string(),
});

export const registerValidator = z.object({
  email: emailValidator,
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: passwordValidator,
});

export const updateProfileValidator = z.object({
  username: z.string().min(3).optional(),
  language: z.enum(['en', 'fa']).optional(),
  theme: z.enum(['light', 'dark']).optional(),
});

export const createProjectValidator = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  type: z.enum(['general', 'game_creation', 'animation']).default('general'),
});

export const updateProjectValidator = createProjectValidator.partial();
