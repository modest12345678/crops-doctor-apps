# Potato Disease Detector

## Overview

This is an AI-powered potato disease detection application that uses OpenAI's GPT-5 Vision API to analyze images of potato plants and identify diseases. Users can upload photos from their camera or file system, receive instant disease identification with confidence scores, view detailed treatment recommendations, and maintain a history of past detections. The application also includes a training data submission feature to help improve the AI model over time.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI Component System**: Built on shadcn/ui (Radix UI primitives) with Tailwind CSS for styling. The design system uses a "New York" style variant with custom color tokens and spacing system. Components are modular and reusable, located in `client/src/components/ui/`.

**State Management**: TanStack Query (React Query) handles server state management, data fetching, and caching. The application uses optimistic updates and automatic cache invalidation to keep the UI responsive.

**Routing**: Wouter provides lightweight client-side routing with three main routes:
- `/` - Home page for disease detection
- `/history` - View past detections
- `/training` - Submit training data to improve the AI

**Design System**: Custom Tailwind configuration with hover and active elevation effects, consistent border radius values, and a comprehensive color palette supporting light/dark modes. Typography uses Inter for UI elements and includes specific styling for AI-generated content.

### Backend Architecture

**Server Framework**: Express.js with TypeScript, serving both API endpoints and the Vite development server in development mode.

**API Design**: RESTful endpoints structured as:
- `POST /api/detect` - Submit images for disease analysis
- `GET /api/detections` - Retrieve detection history
- `POST /api/training` - Submit training data
- `GET /api/training` - Retrieve training data submissions

**Data Storage**: Currently uses in-memory storage (`MemStorage` class) with Map-based data structures. The schema is defined using Drizzle ORM with PostgreSQL dialect, prepared for future database integration. The storage layer follows an interface pattern (`IStorage`) for easy swapping between implementations.

**Request Processing**: 
- Request logging middleware tracks API calls with duration and response data
- JSON body parsing with raw body preservation for potential webhook integrations
- Zod validation ensures type safety for incoming requests

### External Dependencies

**OpenAI GPT-5 Vision API**: The core AI service for disease detection. Images are sent as base64-encoded data to the GPT-5 model with a specialized system prompt that identifies common potato diseases including Late Blight, Early Blight, Potato Virus Y, Blackleg, Common Scab, Potato Leafroll Virus, Fusarium Dry Rot, and healthy plants. Returns structured JSON responses with disease name, confidence level, description, symptoms, and treatment recommendations.

**Database**: Configured for PostgreSQL via Neon serverless driver, though currently using in-memory storage. The Drizzle schema defines two tables:
- `detections` - Stores disease detection results with image data and AI analysis
- `training_data` - Collects user-submitted data for model improvement

**Build & Development Tools**:
- Vite for frontend bundling and HMR
- esbuild for backend compilation
- Replit-specific plugins for development features (cartographer, dev banner, runtime error overlay)

**UI Component Libraries**: 
- Radix UI for accessible, unstyled primitives
- Lucide React for icons
- date-fns for date formatting
- cmdk for command palette functionality
- embla-carousel for image carousels

### Key Architectural Decisions

**Separation of Concerns**: Clear separation between client (`client/`), server (`server/`), and shared code (`shared/`). Shared schema definitions ensure type safety across the full stack.

**Type Safety**: TypeScript throughout with Zod schemas for runtime validation. Drizzle Zod integration generates TypeScript types from database schema.

**Image Handling**: Images stored as base64 data URLs, allowing simple serialization and transmission without file storage infrastructure. This approach trades storage efficiency for implementation simplicity.

**Progressive Enhancement**: Memory storage allows immediate functionality with plans for PostgreSQL integration. The storage interface abstraction enables switching implementations without changing business logic.

**Development Experience**: Path aliases (`@/`, `@shared/`, `@assets/`) simplify imports. Vite's HMR and React Fast Refresh provide instant feedback during development.

**Design Philosophy**: Content-first approach prioritizing image display, with design guidelines emphasizing visual hierarchy, quick actions, and AI transparency. The UI uses elevation effects (hover-elevate, active-elevate-2) for interactive feedback.