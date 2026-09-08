export interface ProviderConfig {
  name: string;
  apiKey?: string;
  apiUrl?: string;
  timeout: number;
  models?: Record<string, string>;
}

export interface ImageGenParams {
  prompt: string;
  model?: string;
  size?: string;
  quality?: string;
  style?: string;
  seed?: number;
  steps?: number;
  cfg_scale?: number;
  negative_prompt?: string;
}

export interface VideoGenParams {
  prompt: string;
  model?: string;
  duration?: number;
  fps?: number;
  resolution?: string;
}

export interface AudioGenParams {
  prompt: string;
  model?: string;
  duration?: number;
  format?: string;
}

export interface TTSParams {
  text: string;
  voice?: string;
  language?: string;
  speed?: number;
  model?: string;
}

export interface GeneratedContent {
  id: string;
  url: string;
  format: string;
  duration?: number;
  size: number;
  metadata?: Record<string, any>;
}

export interface RateLimitStatus {
  remaining: number;
  resetTime: number;
  limit: number;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface IProvider {
  name: string;
  capabilities: string[];

  initialize(config: ProviderConfig): Promise<void>;

  generateImage(params: ImageGenParams): Promise<GeneratedContent>;
  generateVideo(params: VideoGenParams): Promise<GeneratedContent>;
  generateAudio(params: AudioGenParams): Promise<GeneratedContent>;
  synthesizeSpeech(params: TTSParams): Promise<GeneratedContent>;

  healthCheck(): Promise<boolean>;
  getRateLimit(): Promise<RateLimitStatus>;

  validateInput(type: string, input: any): Promise<ValidationResult>;
  validateCredentials(): Promise<boolean>;
}
