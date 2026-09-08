/**
 * Type definitions for frontend
 */

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin' | 'moderator';
  preferences: {
    language: 'en' | 'fa';
    theme: 'light' | 'dark';
  };
}

export interface Job {
  id: string;
  type: string;
  status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'normal' | 'high';
  input: Record<string, any>;
  output?: Record<string, any>;
  result?: {
    contentUrl: string;
    format: string;
    size?: number;
  };
  error?: {
    code: string;
    message: string;
  };
  progress?: {
    percentage: number;
    stage: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  description?: string;
  assets: string[];
  jobs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  type: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
  requestId: string;
}
