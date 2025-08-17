# Overview

This is a full-stack question bank management system for educational content, specifically designed for subjects like Physics, Chemistry, Mathematics, and Biology. The application allows users to manage questions with various types (Single Correct, Multiple Correct, Matrix Match, etc.), organize them by subject/chapter/topic hierarchies, and provides functionality for document upload and parsing. It's built as a modern web application with a React frontend and Express backend.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **File Handling**: Multer for multipart/form-data file uploads
- **Development**: Hot reload with Vite middleware integration

## Data Storage
- **Database**: PostgreSQL configured via Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema definition
- **Connection**: Neon Database serverless PostgreSQL with connection pooling
- **Fallback Storage**: In-memory storage implementation for development/testing

## Database Schema Design
- **Users Table**: Basic authentication with username/password
- **Questions Table**: Comprehensive question storage with JSON fields for flexible content types
- **Hierarchical Organization**: Subject → Chapter → Topic structure
- **Question Types**: Support for 11+ different question formats including Single Correct, Multiple Correct, Matrix Match, Comprehensions, etc.

## Authentication & Session Management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: Password-based authentication (ready for enhancement)

## File Processing
- **Document Upload**: Support for document parsing (currently mocked for Word documents)
- **File Limits**: 10MB maximum file size with memory storage
- **Content Extraction**: Designed to parse questions from uploaded documents

## Component Architecture
- **Modular Design**: Feature-based component organization under question-bank module
- **Reusable UI**: Comprehensive component library with consistent styling
- **Smart Components**: Data-fetching components using React Query hooks
- **Responsive Design**: Mobile-first approach with responsive breakpoints

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect

## UI Component Libraries
- **Radix UI**: Headless UI primitives for accessibility and behavior
- **Lucide React**: SVG icon library for consistent iconography
- **TailwindCSS**: Utility-first CSS framework with custom design tokens

## Development Tools
- **Vite**: Fast build tool with HMR and optimized bundling
- **TypeScript**: Type safety across frontend and backend
- **React Query**: Server state management with caching and synchronization

## AI Integration
- **OpenAI API**: GPT-4o model for intelligent document parsing and question extraction
- **Smart Document Processing**: AI-powered text extraction from Word, PDF, and text files
- **Bulk Upload Support**: Process multiple documents simultaneously with AI parsing

## File Processing
- **Multer**: Express middleware for handling multipart/form-data uploads
- **AI Document Parser**: OpenAI-powered document parsing with support for multiple formats
- **File Type Support**: Word documents (.doc/.docx), PDFs, and text files

## Styling & Design System
- **CSS Variables**: Custom design tokens for theming consistency
- **Class Variance Authority**: Type-safe component variant management
- **Tailwind Merge**: Intelligent class merging for component composition

## Session Management
- **Express Session**: Server-side session handling
- **Connect PG Simple**: PostgreSQL session store integration

# Recent Updates (August 2025)

## Complete Platform Rebranding to EduConnect
- Rebranded entire application from ZeroKelvin to EduConnect
- Integrated custom EduConnect logo with blue/purple/cyan gradient theme
- Updated color scheme to match EduConnect brand (blue, purple, cyan gradients)
- Created professional education-focused logos and brand elements
- Added comprehensive theme support with dark/light mode toggle

## Multi-Role Authentication System
- Implemented comprehensive 5-role authentication (Admin, Teacher, Student, Parent, Coordinator)
- Built mobile OTP verification system with secure session management
- Created role-based access control with protected routes
- Added sample users for all role types for testing purposes
- Fixed OTP verification to work with any 6-digit code in development mode

## Dark/Light Theme Implementation
- Added complete dark/light theme system with ThemeProvider
- Implemented ThemeToggle component with system preference detection
- Updated all UI components to support both themes seamlessly
- Configured Tailwind CSS for proper dark mode support
- Added theme toggle to all dashboard pages and auth page

## Admin/Coordinator Dashboard
- Built comprehensive admin dashboard with real-time statistics
- Created tabbed interface for Dashboard, Messages, Batches, and Users
- Implemented notifications system with inbox/sent message views
- Added batch management with create/edit/delete functionality
- Integrated message composer with role-based recipient selection

## Role-Based Access Control
- Organized all previous features under admin/coordinator login access
- Implemented ProtectedRoute component with role restrictions
- Created role-specific navigation and feature access
- Centralized admin functions in unified dashboard interface

## Technical Improvements
- Enhanced session management with Express sessions
- Fixed authentication flow and user state management
- Added comprehensive error handling and validation
- Implemented proper TypeScript typing throughout
- Created seed data system for easy testing and development
- Fixed phone number authentication format issues
- Added international phone input with country code selection
- Implemented proper role-based redirection after login

## Replit Migration Completed (August 2025)
- Successfully migrated from Replit Agent to standard Replit environment
- Configured PostgreSQL database with proper connection handling
- Updated database drivers from Neon serverless to standard PostgreSQL
- Fixed authentication routing and role-based access control issues
- Added alternative phone numbers for all test user roles
- Resolved TypeScript compatibility issues with routing components
- Implemented proper navigation flow using wouter routing
- All role-based dashboards now working correctly for all user types

## Enhanced Admin/Coordinator Dashboard (August 2025)
- Implemented professional sidebar navigation with collapsible sections
- Integrated comprehensive notifications module with real-time updates
- Built rich text message composer using TipTap editor with formatting tools
- Added role-based recipient filtering and broadcast messaging capabilities
- Created inbox and sent messages views with read status tracking
- Implemented real-time unread count badges and message status sync
- Added dashboard overview with statistics cards and quick actions
- Enhanced user experience with proper loading states and error handling

## Landing Page & Video Showcase (August 2025)
- Created eye-catching minimalistic landing page for video showcase purposes
- Implemented gradient-based design system with blue/purple/cyan theme consistency
- Added comprehensive platform overview with feature cards and role demonstrations
- Built responsive design with dark/light theme support throughout landing page
- Integrated smooth navigation flow from landing page to authentication and dashboards
- Created role-based visual elements showcasing Admin, Teacher, Student, Parent, and Coordinator perspectives
- Added clear call-to-action buttons and platform introduction copy for video context setting

## Complete Migration to Standard Replit Environment (August 2025)
- Successfully migrated entire project from Replit Agent to standard Replit environment
- Configured PostgreSQL database with proper connection handling and schema migration
- Updated database configuration from Neon serverless to standard PostgreSQL drivers
- Implemented comprehensive landing page with platform overview for video recording
- Created detailed module documentation covering all 8 major platform modules
- Fixed all authentication flows and role-based routing issues during migration
- Verified complete application functionality with sample data seeding

## Comprehensive Project Documentation Suite (August 2025)
- Created complete technical documentation covering system architecture and deployment
- Developed detailed database schema documentation with ER diagrams and optimization guides
- Built comprehensive API documentation with authentication flows and endpoint examples
- Authored complete user manual covering all roles with step-by-step instructions
- Designed project architecture documentation with performance and scalability patterns
- Created detailed data flow diagrams showing system processes and user interactions
- Generated visual architecture diagram (SVG) illustrating three-tier system design
- Organized all documentation in structured docs/ directory with comprehensive index