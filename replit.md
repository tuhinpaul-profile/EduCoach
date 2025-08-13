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

# Recent Updates (January 2025)

## AI-Powered Document Parsing Implementation
- Integrated OpenAI GPT-4o for intelligent question extraction from documents
- Added support for multiple file formats: Word documents, PDFs, and text files
- Implemented bulk upload functionality for processing multiple documents simultaneously
- Enhanced question classification and content structure recognition

## Enhanced Upload Features
- Single document upload with AI parsing at `/api/ai/parse-document`
- Bulk document upload processing at `/api/ai/bulk-upload`
- Improved file validation and error handling
- Real-time upload progress tracking and status reporting

## User Interface Improvements
- Added bulk upload modal with drag-and-drop support
- Enhanced upload interface with better file type support
- Improved navigation and fixed broken links
- Added proper TypeScript typing throughout the application