/**
 * Type definitions for mobile app
 */

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
}

export interface Job {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    contentUrl: string;
  };
  createdAt: string;
}

export interface NavigationParams {
  jobId?: string;
  projectId?: string;
}
