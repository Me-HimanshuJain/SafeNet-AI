# SafeNet AI

## Overview

SafeNet AI is a campus safety and emergency response platform that provides real-time monitoring, AI-powered threat detection, and incident management. The system features a Security Operations Center dashboard with live camera feeds, campus mapping, alert management, and mobile applications for both students (SOS) and security guards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for global safety state (emergency mode, alerts), TanStack Query for server state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables, dark mode optimized design
- **Animations**: Framer Motion for UI transitions and emergency alerts

The frontend is organized with:
- `/client/src/pages/` - Main views (Dashboard, Analytics, MobileSOS, MobileGuard)
- `/client/src/components/` - Reusable UI components including dashboard-specific components
- `/client/src/lib/` - Utilities, context providers, and API client

### Backend Architecture
- **Primary Server**: Express.js (Node.js/TypeScript) serving both API and static files
- **Secondary Server**: FastAPI (Python) for AI/ML services integration
- **Build System**: esbuild for server bundling, Vite for client bundling

The Express server handles:
- API routes under `/api` prefix
- Static file serving for production builds
- Vite dev middleware integration for development

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `/shared/schema.ts` - defines users table with UUID primary keys
- **Session Storage**: In-memory storage class (`MemStorage`) with interface for future database migration
- **Migrations**: Drizzle Kit manages schema migrations in `/migrations`

### AI/ML Services (Python Backend)
- Mock implementations for Google Cloud services:
  - Vertex AI for predictions
  - Vision AI for image/video analysis
  - Speech-to-Text for audio transcription
- Configuration via Pydantic settings with environment variables
- JSON structured logging

### Key Design Patterns
- **Monorepo Structure**: Shared types between client and server via `/shared/` directory
- **Type Safety**: Zod schemas generated from Drizzle for validation
- **Component Architecture**: Atomic design with shadcn/ui as foundation
- **Context-based State**: Safety context provides emergency state and alert management across components

## External Dependencies

### Third-Party Services
- **Google Cloud Platform** (configured but mocked):
  - Vision AI for camera feed analysis
  - Vertex AI for ML predictions
  - Speech-to-Text for emergency audio processing

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Key NPM Packages
- `@tanstack/react-query` - Server state management
- `drizzle-orm` / `drizzle-zod` - Database ORM and validation
- `express` - HTTP server
- `framer-motion` - Animations
- `recharts` - Analytics charts
- `wouter` - Client routing

### Python Dependencies
- `fastapi` / `uvicorn` - Python API server
- `pydantic-settings` - Configuration management
- `google-cloud-*` - GCP service SDKs (Vision, Speech, AI Platform)