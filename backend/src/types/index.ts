/**
 * Core Type Definitions for AI Platform
 * These types define the fundamental data structures used throughout the system
 */

// ============================================================================
// Job Types
// ============================================================================

export enum JobType {
  IMAGE_GENERATION = 'image_generation',
  VIDEO_GENERATION = 'video_generation',
  AUDIO_GENERATION = 'audio_generation',
  TEXT_TO_SPEECH = 'text_to_speech',
  TEXT_GENERATION = 'text_generation',
  CHARACTER_GENERATION = 'character_generation',
  ASSET_3D_GENERATION = 'asset_3d_generation',
  GAME_CREATION = 'game_creation',
  GAME_BUILD = 'game_build',
  ANIMATION_GENERATION = 'animation_generation',
}

export enum JobStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum JobPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

export interface JobProgressInfo {
  percentage: number;
  stage: string;
  estimatedTimeRemaining?: number;
  details?: Record<string, any>;
}

export interface JobErrorInfo {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface JobMetadata {
  requestedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  executionTime?: number;
  retryCount: number;
  maxRetries: number;
  cost?: number;
  provider?: string;
}

export interface JobResult {
  contentUrl: string;
  contentId?: string;
  format?: string;
  size?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface IJob {
  id: string;
  userId: string;
  type: JobType;
  status: JobStatus;
  priority: JobPriority;
  input: Record<string, any>;
  output?: Record<string, any>;
  result?: JobResult;
  error?: JobErrorInfo;
  progress?: JobProgressInfo;
  metadata: JobMetadata;
  webhookUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Provider Types
// ============================================================================

export enum ProviderCapability {
  IMAGE_GENERATION = 'image_generation',
  VIDEO_GENERATION = 'video_generation',
  AUDIO_GENERATION = 'audio_generation',
  TEXT_TO_SPEECH = 'text_to_speech',
  TEXT_GENERATION = 'text_generation',
  CHARACTER_GENERATION = 'character_generation',
  ASSET_3D_GENERATION = 'asset_3d_generation',
  GAME_CREATION = 'game_creation',
  ANIMATION_GENERATION = 'animation_generation',
}

export interface ProviderRateLimit {
  requestsPerMinute: number;
  requestsPerDay: number;
  currentUsage?: number;
  resetAt?: Date;
}

export interface ProviderConfig {
  name: string;
  enabled: boolean;
  capabilities: ProviderCapability[];
  priority: number;
  rateLimits: ProviderRateLimit;
  timeout: number;
  retryPolicy?: {
    maxRetries: number;
    backoffMultiplier: number;
    initialDelayMs: number;
  };
  metadata?: Record<string, any>;
}

export interface ProviderHealthCheck {
  healthy: boolean;
  responseTime: number;
  timestamp: Date;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

// ============================================================================
// User & Authentication Types
// ============================================================================

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export interface UserQuotas {
  monthlyGenerations: number;
  monthlyUsed: number;
  storageGB: number;
  storageUsed: number;
}

export interface UserPreferences {
  language: 'en' | 'fa';
  theme: 'light' | 'dark';
  defaultProvider?: string;
  notificationsEnabled: boolean;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  apiKey?: string;
  role: UserRole;
  preferences: UserPreferences;
  quotas: UserQuotas;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ============================================================================
// Project Types
// ============================================================================

export enum ProjectType {
  IMAGE_COLLECTION = 'image_collection',
  VIDEO_PROJECT = 'video_project',
  GAME_PROJECT = 'game_project',
  AUDIO_PROJECT = 'audio_project',
  MIXED_MEDIA = 'mixed_media',
}

export interface ProjectSettings {
  isPublic: boolean;
  allowComments: boolean;
  allowSharing: boolean;
  tags?: string[];
  description?: string;
}

export interface IProject {
  id: string;
  userId: string;
  name: string;
  type: ProjectType;
  description?: string;
  settings: ProjectSettings;
  assets: string[]; // Asset IDs
  jobs: string[]; // Job IDs
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Game-Specific Types
// ============================================================================

export enum GameEngineType {
  UNITY = 'unity',
  UNREAL = 'unreal',
  GODOT = 'godot',
  BABYLON_JS = 'babylon_js',
  THREE_JS = 'three_js',
}

export interface GameLevel {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration?: number;
  objectives?: string[];
  assets?: string[];
}

export interface GameScene {
  id: string;
  name: string;
  type: string;
  environmentAssets?: string[];
  characters?: string[];
  props?: string[];
}

export interface GameCharacter {
  id: string;
  name: string;
  modelAssetId?: string;
  animationAssetIds?: string[];
  soundAssetIds?: string[];
  attributes?: Record<string, any>;
}

export interface GameProjectConfig {
  engine: GameEngineType;
  targetPlatforms: ('ios' | 'android' | 'web' | 'desktop')[];
  dimensions?: {
    width: number;
    height: number;
  };
  aspectRatio?: string;
  fps?: number;
}

export interface IGameProject extends IProject {
  type: ProjectType.GAME_PROJECT;
  config: GameProjectConfig;
  levels: GameLevel[];
  scenes: GameScene[];
  characters: GameCharacter[];
  sourceCode?: string;
  buildOutput?: {
    path: string;
    format: string;
    size: number;
  };
}

// ============================================================================
// Content/Asset Types
// ============================================================================

export enum ContentType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
  MODEL_3D = '3d_model',
  CHARACTER = 'character',
  SCENE = 'scene',
  ANIMATION = 'animation',
  GAME = 'game',
}

export interface IContent {
  id: string;
  userId: string;
  projectId?: string;
  jobId?: string;
  type: ContentType;
  name: string;
  description?: string;
  url: string;
  storageKey: string;
  mimeType: string;
  size: number;
  duration?: number;
  metadata?: Record<string, any>;
  tags?: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Routing Types
// ============================================================================

export interface RoutingContext {
  jobType: JobType;
  capabilities: ProviderCapability[];
  userPreferences?: UserPreferences;
  costConstraint?: 'low' | 'medium' | 'high';
  qualityConstraint?: 'low' | 'medium' | 'high';
  latencyConstraint?: 'low' | 'medium' | 'high';
}

export interface RoutingDecision {
  providerId: string;
  providerName: string;
  reasoning: string;
  fallbackProviders?: string[];
}

// ============================================================================
// Sandbox Types
// ============================================================================

export interface SandboxExecutionRequest {
  id: string;
  code: string;
  language: 'javascript' | 'python' | 'bash';
  timeout: number;
  memoryLimit: number;
  cpuLimit: number;
  environment?: Record<string, string>;
  workingDirectory?: string;
  inputFiles?: Array<{ path: string; content: string }>;
}

export interface SandboxExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  outputFiles?: Array<{ path: string; content: string }>;
  error?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: Date;
  requestId: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: PaginationMeta;
}

// ============================================================================
// Error Types
// ============================================================================

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  SANDBOX_ERROR = 'SANDBOX_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
