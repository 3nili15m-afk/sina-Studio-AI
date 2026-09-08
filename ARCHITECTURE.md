# AI Platform Architecture

## Overview

This is a production-oriented AI platform designed to orchestrate multiple AI capabilities (image generation, video generation, audio generation, text-to-speech) through a unified, extensible interface.

### Core Principles

- **Provider-Agnostic**: The core system is independent of specific AI providers
- **Modular**: Each AI capability and provider is self-contained
- **Secure**: No hardcoded credentials, environment-based configuration
- **Asynchronous**: Long-running operations are non-blocking
- **Extensible**: New providers and capabilities can be added without modifying core logic
- **Observable**: Complete job tracking, logging, and progress monitoring

## Architecture Layers

### 1. API Gateway Layer
- Express.js REST API
- Request validation and sanitization
- Authentication & authorization
- Request/response transformation
- Rate limiting
- CORS handling
- Persian/Farsi localization

### 2. Orchestrator Layer
- Central request processor
- Task decomposition
- Intelligent routing to appropriate providers
- Job state machine management
- Error recovery and retry logic
- Asynchronous job queue (Bull with Redis)

### 3. Routing Layer
- Analyzes incoming requests
- Selects appropriate provider based on:
  - Capability type (image, video, audio, tts)
  - Quality requirements
  - Cost constraints
  - Provider availability
  - User preferences
- Provider capability matrix

### 4. Provider Integration Layer
- Provider abstraction interface (ProviderAdapter)
- Agnes AI provider implementation
- Future provider stubs (OpenAI, Stability, etc.)
- Authentication handling per provider
- Rate limit management
- Error handling and transformation

### 5. Execution Sandbox
- Secure task execution environment
- Input validation
- Resource limits (timeout, memory)
- Output sanitization
- Execution isolation

### 6. Backend Services
- Job management service
- Content storage service
- User management service
- Webhook/notification service
- Analytics service

### 7. Data Layer
- MongoDB for job metadata and user data
- Redis for caching and job queue
- S3-compatible storage for generated content
- File system backup storage

### 8. Frontend Layer
- React SPA with TypeScript
- Persian/Farsi localization (i18n)
- RTL support
- Modern AI studio UI
- Real-time job status tracking
- Responsive design

## Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Task Queue**: Bull (Redis-backed)
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis
- **Storage**: MinIO (S3-compatible) + local filesystem
- **Validation**: Zod or Joi
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Process Management**: PM2 (development) / systemd (production)

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit or Zustand
- **HTTP Client**: Axios
- **UI Components**: Material-UI or Shadcn/ui
- **Localization**: i18next
- **Real-time**: Socket.io or WebSocket
- **Testing**: Vitest + React Testing Library

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Docker Compose (single server), K8s (future scaling)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana (future)
- **Reverse Proxy**: Nginx

### Development
- **Version Control**: Git
- **Package Manager**: npm/yarn
- **Environment**: .env.example for documentation
- **Code Quality**: ESLint, Prettier, Husky

## Folder Structure

```
.
├── backend/                          # Backend services
│   ├── src/
│   │   ├── api/                      # API routes
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   └── validators/
│   │   ├── orchestrator/             # Central orchestration
│   │   │   ├── Orchestrator.ts
│   │   │   ├── routing/
│   │   │   └── strategies/
│   │   ├── providers/                # AI Provider implementations
│   │   │   ├── interfaces/           # Provider contract
│   │   │   ├── agnes/                # Agnes AI provider
│   │   │   ├── openai/               # Future OpenAI provider
│   │   │   └── registry.ts           # Provider registry
│   │   ├── jobs/                     # Job management
│   │   │   ├── JobManager.ts
│   │   │   ├── JobQueue.ts
│   │   │   ├── models/
│   │   │   └── workers/
│   │   ├── sandbox/                  # Execution sandbox
│   │   │   ├── Sandbox.ts
│   │   │   ├── validators/
│   │   │   └── limiters/
│   │   ├── storage/                  # Storage layer
│   │   │   ├── ContentStorage.ts
│   │   │   ├── providers/
│   │   │   └── models/
│   │   ├── database/                 # Database models & config
│   │   │   ├── models/
│   │   │   ├── connection.ts
│   │   │   └── migrations/
│   │   ├── services/                 # Business logic
│   │   │   ├── ContentService.ts
│   │   │   ├── UserService.ts
│   │   │   └── NotificationService.ts
│   │   ├── config/                   # Configuration
│   │   │   ├── index.ts
│   │   │   ├── providers.ts
│   │   │   └── environment.ts
│   │   ├── utils/                    # Utilities
│   │   │   ├── logger.ts
│   │   │   ├── errors.ts
│   │   │   └── validators.ts
│   │   ├── types/                    # TypeScript type definitions
│   │   │   ├── api.ts
│   │   │   ├── providers.ts
│   │   │   ├── jobs.ts
│   │   │   └── common.ts
│   │   └── app.ts                    # Express app setup
│   ├── tests/                        # Test files
│   ├── docker/                       # Docker configuration
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   │   ├── common/
│   │   │   ├── studio/
│   │   │   ├── job/
│   │   │   └── layout/
│   │   ├── pages/                    # Route pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Studio.tsx
│   │   │   ├── Jobs.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/                 # API client services
│   │   │   ├── api.ts
│   │   │   ├── jobs.ts
│   │   │   └── content.ts
│   │   ├── store/                    # State management (Redux/Zustand)
│   │   │   ├── slices/
│   │   │   └── store.ts
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── types/                    # TypeScript types
│   │   ├── i18n/                     # Localization
│   │   │   ├── locales/
│   │   │   │   ├── en.json
│   │   │   │   └── fa.json
│   │   │   └── config.ts
│   │   ├── styles/                   # Global styles
│   │   ├── utils/                    # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/                        # Test files
│   ├── public/                       # Static assets
│   ├── .env.example
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml                # Docker Compose orchestration
├── docker-compose.prod.yml           # Production Docker Compose
├── nginx.conf                        # Nginx reverse proxy config
├── .github/
│   └── workflows/                    # CI/CD pipelines
│       ├── test.yml
│       ├── build.yml
│       └── deploy.yml
├── docs/                             # Documentation
│   ├── API.md                        # API documentation
│   ├── PROVIDERS.md                  # Provider integration guide
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── DEVELOPMENT.md                # Development guide
├── .env.example                      # Example environment variables
├── .gitignore
├── README.md
└── ARCHITECTURE.md                   # This file
```

## Data Models

### Job
```typescript
{
  id: string (UUID)
  userId: string
  type: "image_generation" | "video_generation" | "audio_generation" | "text_to_speech"
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  provider: string
  input: Record<string, any>
  output?: Record<string, any>
  result?: {
    contentUrl: string
    duration?: number
    format: string
    size: number
  }
  error?: {
    code: string
    message: string
    details?: any
  }
  progress?: {
    percentage: number
    stage: string
    estimatedTime?: number
  }
  metadata: {
    requestedAt: timestamp
    startedAt?: timestamp
    completedAt?: timestamp
    executionTime?: number
    cost?: number
  }
  retryCount: number
  maxRetries: number
}
```

### Provider Configuration
```typescript
{
  name: string
  enabled: boolean
  capabilities: string[] // ["image_generation", "video_generation", ...]
  priority: number
  config: Record<string, any>
  credentials: {
    apiKey?: string
    apiSecret?: string
    endpoint?: string
  }
  rateLimits: {
    requestsPerMinute: number
    requestsPerDay: number
  }
  models: Record<string, string>
  costPerUnit?: Record<string, number>
}
```

### User
```typescript
{
  id: string (UUID)
  email: string
  username: string
  password: string (hashed)
  apiKey?: string
  preferences: {
    language: "en" | "fa"
    theme: "light" | "dark"
    defaultProvider?: string
    notifications: boolean
  }
  quotas: {
    monthlyGenerations: number
    monthlyUsed: number
    storageGB: number
    storageUsed: number
  }
  createdAt: timestamp
  updatedAt: timestamp
}
```

## API Design

### Job Creation
```
POST /api/v1/jobs
{
  type: "image_generation" | "video_generation" | "audio_generation" | "text_to_speech"
  input: {
    [capability-specific parameters]
  }
  priority?: "low" | "normal" | "high"
  webhookUrl?: string
}

Response: 201 Created
{
  jobId: string
  status: "pending"
  estimatedWait: number
}
```

### Job Status
```
GET /api/v1/jobs/{jobId}

Response: 200 OK
{
  id: string
  status: "pending" | "processing" | "completed" | "failed"
  progress?: {
    percentage: number
    stage: string
  }
  result?: {
    contentUrl: string
    format: string
  }
  error?: {
    code: string
    message: string
  }
}
```

### Content Upload (for input resources)
```
POST /api/v1/content/upload
multipart/form-data: file

Response: 201 Created
{
  contentId: string
  url: string
  expiresAt: timestamp
}
```

## Orchestrator Design

```
Request → Orchestrator.execute()
  ├─ Validate request (Sandbox)
  ├─ Select provider (Router)
  ├─ Create job record (Database)
  ├─ Enqueue task (Job Queue)
  └─ Return job ID immediately

Worker Process
  ├─ Dequeue job
  ├─ Initialize provider
  ├─ Execute task with sandbox
  ├─ Update job status/progress
  ├─ Store result
  ├─ Notify user (webhook/socket)
  └─ Handle errors with retry logic
```

## Provider Abstraction

```typescript
interface IProvider {
  name: string
  capabilities: string[]
  
  // Configuration
  initialize(config: ProviderConfig): Promise<void>
  
  // Capability execution
  generateImage(params: ImageGenParams): Promise<GeneratedContent>
  generateVideo(params: VideoGenParams): Promise<GeneratedContent>
  generateAudio(params: AudioGenParams): Promise<GeneratedContent>
  synthesizeSpeech(params: TTSParams): Promise<GeneratedContent>
  
  // Health & status
  healthCheck(): Promise<boolean>
  getRateLimit(): Promise<RateLimitStatus>
  
  // Validation
  validateInput(type: string, input: any): Promise<ValidationResult>
  validateCredentials(): Promise<boolean>
}
```

## Routing Strategy

1. **Provider Matching**: Filter providers by capability
2. **Availability Check**: Health check and rate limit validation
3. **Priority Selection**: User preference → config priority → first available
4. **Load Balancing**: Distribute across available providers
5. **Fallback**: Secondary provider if primary fails

## Security Considerations

- All credentials via environment variables
- Input validation and sanitization
- Rate limiting per user/IP
- Sandbox execution with resource limits
- Audit logging of all operations
- JWT authentication for API
- HTTPS/TLS in production
- Database encryption at rest
- Content virus scanning (future)

## Deployment Architecture

### Single Server (Docker Compose)
```
nginx (reverse proxy)
├─ backend (Express API + workers)
├─ frontend (React SPA)
├─ mongodb (database)
├─ redis (cache/queue)
└─ minio (storage)
```

### Scalable (Future - Kubernetes)
```
Ingress/Load Balancer
├─ API Services (replicas)
├─ Worker Services (replicas)
├─ Frontend (CDN)
├─ MongoDB (replicated)
├─ Redis (clustered)
└─ S3-compatible storage
```

## Configuration System

Environment variables by service:

### Backend
- `NODE_ENV`: development/production
- `PORT`: API port
- `DATABASE_URL`: MongoDB connection
- `REDIS_URL`: Redis connection
- `STORAGE_PATH`: Local storage directory
- `MINIO_ENDPOINT`: S3-compatible endpoint
- `JWT_SECRET`: Token signing secret
- Provider-specific: `AGNES_API_KEY`, `OPENAI_API_KEY`, etc.

### Frontend
- `VITE_API_URL`: Backend API URL
- `VITE_SOCKET_URL`: WebSocket URL
- `VITE_ENVIRONMENT`: development/production

## Testing Strategy

### Backend
- Unit tests: Service logic, utilities
- Integration tests: API endpoints, database
- Provider tests: Mock provider implementations
- End-to-end: Full job lifecycle

### Frontend
- Unit tests: Components, hooks, utilities
- Integration tests: Page flows
- E2E tests: User workflows (Cypress/Playwright)

## Implementation Roadmap

### Phase 1: Foundation
- [ ] Backend project setup with Express
- [ ] Database schema and models
- [ ] Authentication system (JWT)
- [ ] Job queue infrastructure (Bull + Redis)
- [ ] Basic API endpoints

### Phase 2: Core Orchestrator
- [ ] Orchestrator implementation
- [ ] Provider abstraction layer
- [ ] Agnes AI provider integration
- [ ] Job lifecycle management
- [ ] Error handling and retries

### Phase 3: Frontend
- [ ] React app setup
- [ ] Authentication UI
- [ ] Studio interface for job creation
- [ ] Job monitoring dashboard
- [ ] i18n (Persian/English) with RTL

### Phase 4: Storage & Advanced Features
- [ ] Content storage service
- [ ] Generated content delivery
- [ ] Webhook notifications
- [ ] Advanced routing strategies
- [ ] Analytics

### Phase 5: DevOps & Deployment
- [ ] Docker containerization
- [ ] Docker Compose orchestration
- [ ] Nginx configuration
- [ ] CI/CD pipelines
- [ ] Production deployment guide

## Key Design Decisions

1. **Redis + Bull for Job Queue**: Reliable, scalable, Redis-backed task queue suitable for background job processing
2. **MongoDB for Metadata**: Flexible schema for varied job inputs/outputs
3. **Provider Adapter Pattern**: Enables adding providers without touching core logic
4. **Sandbox Execution**: Resource limits and timeout protection for untrusted provider calls
5. **Async-First Architecture**: Long operations never block API responses
6. **Environment-Based Config**: Enables secure deployment across environments
7. **Persian-First i18n**: RTL support built in from the start
8. **API-First Design**: Frontend and external tools use same API

## Security Checklist

- [ ] No credentials in code/commits
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Authentication/authorization on all protected routes
- [ ] Encrypted database credentials
- [ ] HTTPS in production
- [ ] CORS properly configured
- [ ] SQL injection protection (Mongoose)
- [ ] XSS protection in frontend
- [ ] CSRF protection
- [ ] Audit logging implemented
- [ ] Error messages don't leak sensitive info
