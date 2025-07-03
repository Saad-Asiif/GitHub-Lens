![Image](https://github.com/user-attachments/assets/ac8f8366-aa27-43a2-a0a9-015ca7904ed0)

# Repository Health Analyzer

## Overview

This is a full-stack web application that analyzes GitHub repositories to provide comprehensive health metrics. The application features a React frontend with TypeScript, an Express.js backend, and uses Drizzle ORM for database operations. It analyzes various aspects of GitHub repositories including code quality, community engagement, maintenance status, and overall health scores.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **External APIs**: GitHub API integration via Octokit
- **PDF Generation**: Puppeteer for report generation

### Key Technologies
- **Database**: PostgreSQL (configured for Neon Database)
- **Authentication**: GitHub API token-based authentication
- **Development**: Hot module replacement with Vite
- **Deployment**: Production build optimized with esbuild

## Key Components

### Database Schema
- **Repositories Table**: Stores GitHub repository metadata (name, owner, stars, forks, language, etc.)
- **Analyses Table**: Stores analysis results with health scores and detailed JSON data
- **Relationships**: One-to-many relationship between repositories and analyses

### GitHub Service
- Repository URL parsing and validation
- GitHub API integration for fetching repository data
- Analysis algorithm that calculates health scores based on:
  - Code quality metrics
  - Community engagement
  - Maintenance activity
  - Overall repository health

### PDF Service
- HTML template generation for analysis reports
- PDF generation using Puppeteer
- Comprehensive reporting with charts and metrics

### Frontend Components
- **Repository Input**: URL validation and submission
- **Analysis Results**: Comprehensive display of health metrics
- **Health Score Chart**: Circular progress visualization
- **Metric Cards**: Individual metric displays with color coding
- **Commit Chart**: Line chart showing commit activity over time
- **Contributors List**: Display of top contributors with avatars

## Data Flow

1. **Input Phase**: User enters GitHub repository URL through the frontend
2. **Validation**: Frontend validates URL format and GitHub domain
3. **API Request**: Frontend sends analysis request to backend
4. **Data Fetching**: Backend calls GitHub API to fetch repository data
5. **Analysis**: Backend calculates health scores and metrics
6. **Storage**: Results are stored in PostgreSQL database with caching
7. **Response**: Analysis results are returned to frontend
8. **Visualization**: Frontend displays results with charts and metrics
9. **Export**: Optional PDF report generation for sharing

## External Dependencies

### GitHub API Integration
- Octokit library for GitHub API communication
- Token-based authentication for API rate limits
- Repository data fetching including:
  - Basic repository information
  - Contributor statistics
  - Commit activity
  - Issue tracking
  - Community metrics

### Database Integration
- Neon Database for PostgreSQL hosting
- Connection pooling and session management
- Migration system with Drizzle Kit

### UI Dependencies
- Radix UI primitives for accessible components
- Recharts for data visualization
- Lucide React for icons
- Embla Carousel for interactive components

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- TypeScript compilation checking
- Environment variable management

### Production Build
- Frontend: Vite production build with asset optimization
- Backend: esbuild compilation to single JavaScript bundle
- Static asset serving through Express
- Environment-specific configuration

### Database Management
- Drizzle migrations for schema changes
- Push commands for development schema updates
- Production-ready connection handling

## User Preferences
```
Preferred communication style: Simple, everyday language.
```
