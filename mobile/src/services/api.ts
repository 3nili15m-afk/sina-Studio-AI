/**
 * API Client for Mobile
 * Shares configuration with frontend
 */

import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class MobileAPIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
    });

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  setToken(token: string): void {
    this.token = token;
  }

  async createJob(jobData: any): Promise<any> {
    return this.client.post('/v1/jobs', jobData);
  }

  async getJobStatus(jobId: string): Promise<any> {
    return this.client.get(`/v1/jobs/${jobId}`);
  }
}

export default new MobileAPIClient();
