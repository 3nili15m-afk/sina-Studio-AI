# AI Content Creation Platform

A unified, production-grade platform for AI-powered content creation across multiple mediums including images, videos, audio, text, characters, 3D assets, and complete games.

## 🎯 Platform Vision

One unified platform accessible via Web and Mobile applications that allows users to create various types of digital content through a simple, intuitive experience.

### Supported Capabilities

- 🖼️ **Images & Photos**: AI image and photo generation
- 🎬 **Video & Animation**: Video creation and animation generation
- 🎵 **Audio & Music**: Audio and music generation
- 🗣️ **Speech**: Text-to-speech synthesis
- 📝 **Text**: AI-powered text generation
- 👤 **Characters**: Character design and generation
- 🎮 **3D Assets**: 3D model and asset generation
- 🕹️ **Games**: Complete AI-assisted game creation with scenes, levels, characters, and logic

## 🏗️ Architecture Overview

```
Web Client + Mobile Client
        ↓
   Backend API (Express)
        ↓
  Authentication / Users / Projects
        ↓
     Orchestrator (Multi-step workflows)
        ↓
    Routing Layer (Intelligent provider selection)
        ↓
  AI Provider Layer (Agnes, OpenAI, etc.)
        ↓
  Sandbox (Secure isolated execution)
        ↓
   Storage & Results
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose 20.10+
- Node.js 20+ (for development without Docker)
- Git

### Development Setup

```bash
# Clone and setup
git clone https://github.com/safarpour65/sina-.git
cd sina-

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp mobile/.env.example mobile/.env

# Start with Docker Compose
docker-compose up -d

# Access:
# Web App: http://localhost:5173
# API: http://localhost:3000
# Docs: http://localhost:3000/api/docs
```

### Manual Development Setup

```bash
# Backend
cd backend
npm install
npm run dev  # http://localhost:3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev  # http://localhost:5173

# Mobile (new terminal)
cd mobile
npm install
npm start
```

## 📁 Project Structure

```
.
├── backend/                    # Express API + Orchestrator + Providers
│   ├── src/
│   │   ├── api/               # REST endpoints
│   │   ├── orchestrator/       # Central orchestration engine
│   │   ├── routing/           # Intelligent routing layer
│   │   ├── providers/         # AI provider implementations
│   │   ├── sandbox/           # Secure execution environment
│   │   ├── jobs/              # Job queue and management
│   │   ├── storage/           # Content storage abstraction
│   │   ├── database/          # Database models
│   │   ├── services/          # Business logic services
│   │   ├── config/            # Configuration management
│   │   └── utils/             # Utilities and helpers
│   ├── tests/                 # Test suite
│   ├── docker/                # Docker configuration
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                  # React Web Application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API client
│   │   ├── store/             # State management
│   │   ├── i18n/              # Localization (Persian/English)
│   │   ├── types/             # TypeScript types
│   │   └── styles/            # Global styles
│   ├── public/                # Static assets
│   ├── .env.example
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                    # React Native Mobile Application
│   ├── src/
│   │   ├── screens/           # Mobile screens
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API client (shared)
│   │   ├── store/             # State management (shared)
│   │   ├── navigation/        # Navigation setup
│   │   ├── i18n/              # Localization (shared)
│   │   └── types/             # Types (shared)
│   ├── .env.example
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── PROVIDERS.md
│   ├── SANDBOX.md
│   ├── GAME_CREATION.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── SECURITY.md
│
├── docker-compose.yml         # Development environment
├── docker-compose.prod.yml    # Production environment
├── nginx.conf                 # Reverse proxy configuration
├── .env.example               # Root environment template
├── .gitignore
└── README.md
```

## 🔑 Key Features

### Unified User Experience
- Single platform identity (providers are transparent infrastructure)
- Simple creation workflow: request → automatic routing → result
- Support for complex multi-step workflows (e.g., game generation)
- Real-time progress tracking
- Project management and content library

### Extensible Architecture
- Modular provider system for adding new AI services
- Agnes AI fully integrated as first provider
- Clear provider interface for future integrations
- Automatic provider selection based on capability and constraints

### Production-Ready
- Asynchronous job processing
- Comprehensive error handling with retries
- Structured logging and monitoring
- Input validation and sanitization
- Rate limiting and quota management
- Audit trails for all operations

### Security First
- All credentials via environment variables
- No hardcoded secrets
- Secure sandbox execution
- Input validation on all endpoints
- Authentication & authorization
- Data encryption support

### Game Creation First-Class
- Dedicated game project workflows
- Multi-step generation (concept → design → assets → scenes → code → build)
- Scene and level management
- Character and animation support
- Audio integration
- Validation and build system

### Internationalization
- Persian (Farsi) and English support
- Full RTL (Right-to-Left) support
- Localized UI for both web and mobile
- Culturally appropriate defaults

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md) - Detailed system design
- [API Documentation](./docs/API.md) - REST API reference
- [Provider Integration](./docs/PROVIDERS.md) - Adding new AI providers
- [Sandbox System](./docs/SANDBOX.md) - Secure execution environment
- [Game Creation](./docs/GAME_CREATION.md) - Game platform capabilities
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Development Guide](./docs/DEVELOPMENT.md) - Local development
- [Security Guide](./docs/SECURITY.md) - Security practices

## 🔌 Providers

### Currently Integrated
- **Agnes AI** - Full production integration with all capabilities

### Planned
- OpenAI (GPT-4, DALL-E, Whisper)
- Stability AI (Stable Diffusion)
- Replicate (Multi-provider marketplace)

## 🎮 Game Creation Features

- **Game Design Generation**: AI-assisted game concept and design
- **Character Generation**: Procedural character creation
- **Level Design**: Automated level generation
- **Asset Generation**: 3D models, sprites, animations
- **Script Generation**: Game logic and behavior code
- **Audio Integration**: Background music and sound effects
- **Build & Export**: Compile to multiple game engines
- **Project Management**: Version control and iterations

## 🔒 Security

- ✅ Environment-based credential management
- ✅ Input validation and sanitization
- ✅ Sandbox execution with resource limits
- ✅ JWT authentication
- ✅ Rate limiting and quota enforcement
- ✅ Audit logging
- ✅ HTTPS/TLS ready
- ✅ Database encryption support

See [Security Guide](./docs/SECURITY.md) for detailed security practices.

## 🚀 Deployment

### Docker Compose (Recommended for Single Server)

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

See [Deployment Guide](./docs/DEPLOYMENT.md) for:
- Environment configuration
- Database setup
- Service startup
- Monitoring setup
- Backup strategies

## 📊 Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Cache/Queue**: Redis + Bull
- **Storage**: S3-compatible (MinIO)
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest

### Frontend (Web)
- **Framework**: React 18+
- **Language**: TypeScript
- **Build**: Vite
- **UI**: Material-UI / Shadcn/ui
- **State**: Redux Toolkit
- **HTTP**: Axios
- **i18n**: i18next
- **RTL**: Built-in support

### Mobile
- **Framework**: React Native
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State**: Redux Toolkit (shared)
- **HTTP**: Axios (shared)
- **i18n**: i18next (shared)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana (ready)

## 🤝 Contributing

1. Create feature branch
2. Implement with tests
3. Ensure linting passes
4. Submit pull request

See [Development Guide](./docs/DEVELOPMENT.md) for details.

## 📝 Environment Configuration

All configuration uses environment variables. See `.env.example` files:

- `backend/.env.example` - Backend services configuration
- `frontend/.env.example` - Frontend API endpoints
- `mobile/.env.example` - Mobile app configuration

**Never commit actual secrets or credentials.**

## 🆘 Support

For issues, questions, or contributions:

1. Check [Troubleshooting](./docs/DEVELOPMENT.md#troubleshooting)
2. Review existing [GitHub Issues](https://github.com/safarpour65/sina-/issues)
3. Create new issue with details

## 📄 License

Not specified

---

**Version**: 1.0.0  
**Last Updated**: 2026-09-04  
**Status**: Initial Foundation
