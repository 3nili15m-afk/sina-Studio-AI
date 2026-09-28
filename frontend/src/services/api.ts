import axios, { AxiosInstance } from 'axios';
import { APIResponse, Job, Project, User } from '../types';

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

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

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

  getToken(): string | null {
    return this.token;
  }

  async healthCheck(): Promise<any> {
    const response = await this.client.get('/v1/health');
    return response.data;
  }

  async register(email: string, username: string, password: string): Promise<APIResponse<{ user: User; token: string }>> {
    const response = await this.client.post('/v1/auth/register', { email, username, password });
    return response.data;
  }

  async login(email: string, password: string): Promise<APIResponse<{ user: User; token: string }>> {
    const response = await this.client.post('/v1/auth/login', { email, password });
    return response.data;
  }

  async logout(): Promise<APIResponse<any>> {
    const response = await this.client.post('/v1/auth/logout');
    return response.data;
  }

  async getMe(): Promise<APIResponse<User>> {
    const response = await this.client.get('/v1/auth/me');
    return response.data;
  }

  async createJob(jobData: {
    type: string;
    input: Record<string, any>;
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

  async cancelJob(jobId: string): Promise<APIResponse<any>> {
    const response = await this.client.post(`/v1/jobs/${encodeURIComponent(jobId)}/cancel`);
    return response.data;
  }

  async listProjects(): Promise<APIResponse<Project[]>> {
    const response = await this.client.get('/v1/projects');
    return response.data;
  }

  async getProject(id: string): Promise<APIResponse<Project>> {
    const response = await this.client.get(`/v1/projects/${encodeURIComponent(id)}`);
    return response.data;
  }

  async createProject(data: { name: string; type?: string; description?: string }): Promise<APIResponse<Project>> {
    const response = await this.client.post('/v1/projects', data);
    return response.data;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<APIResponse<Project>> {
    const response = await this.client.patch(`/v1/projects/${encodeURIComponent(id)}`, data);
    return response.data;
  }

  async generateImage(prompt: string, size?: string, quality?: string): Promise<APIResponse<any>> {
    const response = await this.client.post('/v1/generate/image', { prompt, size, quality });
    return response.data;
  }

  async generateVideo(prompt: string, duration?: number, fps?: number): Promise<APIResponse<any>> {
    const response = await this.client.post('/v1/generate/video', { prompt, duration, fps });
    return response.data;
  }

  async generateAudio(prompt: string, duration?: number): Promise<APIResponse<any>> {
    const response = await this.client.post('/v1/generate/audio', { prompt, duration });
    return response.data;
  }

  async generateSpeech(text: string, language?: string): Promise<APIResponse<any>> {
    const response = await this.client.post('/v1/generate/speech', { text, language });
    return response.data;
  }
}

export default new APIClient();
