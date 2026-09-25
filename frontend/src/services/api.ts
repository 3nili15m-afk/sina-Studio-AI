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
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use((request) => {
      if (this.token) request.headers.Authorization = `Bearer ${this.token}`;
      return request;
    });

    const savedToken = localStorage.getItem('authToken');
    if (savedToken) this.token = savedToken;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async healthCheck(): Promise<APIResponse<unknown>> {
    const response = await this.client.get('/v1/health');
    return response.data;
  }

  async createJob(jobData: {
    type: string;
    input: Record<string, unknown>;
    priority?: string;
  }): Promise<APIResponse<Job>> {
    const response = await this.client.post('/v1/jobs', jobData);
    return response.data;
  }

  async listJobs(): Promise<APIResponse<Job[]>> {
    const response = await this.client.get('/v1/jobs');
    return response.data;
  }

  async getJobStatus(jobId: string): Promise<APIResponse<Job>> {
    const response = await this.client.get(`/v1/jobs/${encodeURIComponent(jobId)}`);
    return response.data;
  }

  async cancelJob(jobId: string): Promise<APIResponse<Job>> {
    const response = await this.client.post(`/v1/jobs/${encodeURIComponent(jobId)}/cancel`);
    return response.data;
  }
}

export default new APIClient();
