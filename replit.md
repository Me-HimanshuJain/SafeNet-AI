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

### Backend Architecture
- **Primary Server**: Express.js (Node.js/TypeScript) serving both API and static files
- **Secondary Server**: FastAPI (Python) for AI/ML services integration
- **Build System**: esbuild for server bundling, Vite for client bundling

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `/shared/schema.ts`
- **Session Storage**: In-memory storage class (`MemStorage`)

### AI & Intelligence
- **Video Intelligence**: Privacy-first analyzer using OpenCV and MediaPipe (mocked) for fall and loitering detection.
- **Audio Emergency Detection**: Scream and distress keyword recognition.
- **Risk Fusion Engine**: Multi-modal signal merging with cooldown logic.
- **Analytics Engine**: BigQuery-style analytics for incident summarization and predictive risk scoring.
- **Security Enforcer**: Role-based access control (RBAC), API key protection, and GDPR-compliant audit logging.

### Security & Privacy
- **Zero-Storage Policy**: No raw audio/video data is stored; only derived metadata.
- **Ethical AI**: Behavior-based analysis without facial recognition or identity tracking.
- **Audit Trails**: Full logging of security-critical actions.

## External Dependencies

### Third-Party Services
- **Google Cloud Platform** (mocked): Vision AI, Vertex AI, Speech-to-Text.

### Python Dependencies
- `fastapi` / `uvicorn`
- `pydantic-settings`
- `opencv-python`
- `mediapipe`
