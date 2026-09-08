/**
 * API client service
 */

import axios, { AxiosInstance } from 'axios';
import { APIResponse, Job } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Load token from localStorage
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      this.token = savedToken;
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    return this.client.get('/v1/health');
  }

  /**
   * Create a new job
   */
  async createJob(jobData: {
    type: string;
    input: Record<string, any>;
    priority?: string;
  }): Promise<APIResponse<any>> {
    const response = await this.client.post('/v1/jobs', jobData);
    return response.data;
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<APIResponse<Job>> {
    const response = await this.client.get(`/v1/jobs/${jobId}`);
    return response.data;
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<APIResponse<any>> {
    const response = await this.client.post(`/v1/jobs/${jobId}/cancel`);
    return response.data;
  }
}

export default new APIClient();
