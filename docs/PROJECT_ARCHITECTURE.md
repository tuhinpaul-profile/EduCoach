# EduConnect - Project Architecture Document

## Architecture Overview

EduConnect follows a modern three-tier architecture with clear separation of concerns, implementing industry best practices for scalability, maintainability, and security.

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Web App   │  │   Mobile    │  │   Admin     │         │
│  │ (React SPA) │  │   Browser   │  │   Panel     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Load Balancer   │
                    │   (Nginx/Replit)  │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Express   │  │   Socket.io │  │     AI      │          │
│  │   Server    │  │   Server    │  │   Service   │          │
│  │ (REST API)  │  │(WebSockets) │  │  (OpenAI)   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │    Auth     │  │   Business  │  │   File      │          │
│  │  Service    │  │    Logic    │  │  Processing │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└──────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ PostgreSQL  │  │    Redis    │  │    File     │          │
│  │  Database   │  │    Cache    │  │   Storage   │          │
│  │ (Primary)   │  │  (Session)  │  │ (Documents) │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

## System Components

### Frontend Architecture (Presentation Layer)

#### Technology Stack
```typescript
// Core Framework
React 18.3.1 + TypeScript 5.6.3

// Build & Development
Vite 5.4.19 (Build Tool)
ESLint + Prettier (Code Quality)

// UI & Styling
Tailwind CSS 3.4.17 (Styling)
Radix UI + Shadcn/ui (Component Library)
Framer Motion (Animations)
Lucide React (Icons)

// State Management
TanStack Query 5.60.5 (Server State)
React Hook Form 7.55.0 (Form State)
Zustand (Client State - if needed)

// Routing & Navigation
Wouter 3.3.5 (Client-side Routing)
React Router (Alternative option)

// Validation & Type Safety
Zod 3.24.2 (Schema Validation)
TypeScript (Static Type Checking)
```

#### Component Architecture
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI primitives (shadcn/ui)
│   ├── shared/          # Shared business components
│   ├── forms/           # Form-specific components
│   └── layouts/         # Layout components
├── pages/               # Route-based page components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── services/            # API service layer
└── types/               # TypeScript type definitions
```

#### State Management Strategy
```typescript
// Server State (TanStack Query)
const { data: students } = useQuery({
  queryKey: ['students', filters],
  queryFn: () => api.students.list(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Form State (React Hook Form)
const form = useForm<StudentForm>({
  resolver: zodResolver(studentSchema),
  defaultValues: initialValues,
});

// Client State (React Context/Zustand)
const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### Backend Architecture (Application Layer)

#### Technology Stack
```typescript
// Core Framework
Node.js 20+ + Express.js 4.21.2
TypeScript 5.6.3 (Full type safety)

// Database & ORM
PostgreSQL 14+ (Primary database)
Drizzle ORM 0.39.1 (Type-safe ORM)
Drizzle Kit 0.30.4 (Migrations)

// Authentication & Security
Passport.js 0.7.0 (Authentication)
Express Session 1.18.1 (Session management)
bcrypt (Password hashing)
helmet (Security headers)

// File Processing
Multer 2.0.2 (File uploads)
Sharp (Image processing)
pdf-parse (PDF text extraction)

// AI Integration
OpenAI 5.12.2 (Document parsing)
```

#### Service Layer Architecture
```typescript
// Repository Pattern
interface IStudentRepository {
  findById(id: string): Promise<Student | null>;
  findByBatch(batchId: string): Promise<Student[]>;
  create(data: CreateStudent): Promise<Student>;
  update(id: string, data: UpdateStudent): Promise<Student>;
  delete(id: string): Promise<void>;
}

// Service Layer
class StudentService {
  constructor(
    private studentRepo: IStudentRepository,
    private notificationService: NotificationService
  ) {}

  async enrollStudent(data: CreateStudent): Promise<Student> {
    const student = await this.studentRepo.create(data);
    await this.notificationService.sendWelcome(student);
    return student;
  }
}

// Controller Layer
class StudentController {
  constructor(private studentService: StudentService) {}

  async createStudent(req: Request, res: Response) {
    try {
      const data = studentSchema.parse(req.body);
      const student = await this.studentService.enrollStudent(data);
      res.json({ success: true, data: student });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

#### API Design Patterns
```typescript
// RESTful Resource Structure
/api/students              # Student resource
  GET    /                 # List students (with pagination/filtering)
  POST   /                 # Create new student
  GET    /:id              # Get specific student
  PUT    /:id              # Update student
  DELETE /:id              # Delete student
  
/api/students/:id/attendance  # Nested resources
  GET    /                    # Get student attendance
  POST   /                    # Mark attendance

// Middleware Pipeline
app.use('/api', [
  helmet(),                 # Security headers
  cors(),                   # CORS configuration
  rateLimit(),             # Rate limiting
  authenticate(),          # Authentication check
  authorize(),             # Role-based authorization
  validate(),              # Request validation
]);
```

### Database Architecture (Data Layer)

#### Schema Design Principles
```sql
-- 1. Normalized Design (3NF)
-- 2. UUID Primary Keys for security
-- 3. Proper Foreign Key Constraints
-- 4. Strategic Indexing
-- 5. JSONB for flexible content

-- Example: Optimized Student Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    batch_id UUID REFERENCES batches(id),
    parent_info JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_students_batch ON students(batch_id);
CREATE INDEX idx_students_phone ON students(phone);
CREATE INDEX idx_students_active ON students(is_active);
CREATE INDEX idx_students_parent_gin ON students USING GIN(parent_info);
```

#### Database Connection Strategy
```typescript
// Connection Pool Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Close idle connections
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Drizzle Configuration
export const db = drizzle(pool, {
  schema: allTables,
  logger: process.env.NODE_ENV === 'development'
});
```

## Security Architecture

### Authentication Flow
```typescript
// Phone-based Authentication
interface AuthFlow {
  1: "User enters phone + role";
  2: "System generates & sends OTP";
  3: "User enters OTP";
  4: "System validates OTP";
  5: "Session created with role-based permissions";
}

// Session Management
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  store: new PostgreSQLStore({
    pool: dbPool,
    tableName: 'user_sessions'
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  },
  resave: false,
  saveUninitialized: false
};
```

### Authorization System
```typescript
// Role-Based Access Control (RBAC)
enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  COORDINATOR = 'coordinator'
}

// Permission Matrix
const permissions = {
  [UserRole.ADMIN]: ['*'], // All permissions
  [UserRole.TEACHER]: [
    'students:read',
    'attendance:write',
    'questions:write',
    'exams:create'
  ],
  [UserRole.STUDENT]: [
    'attendance:read:own',
    'exams:participate',
    'messages:read:own'
  ],
  [UserRole.PARENT]: [
    'students:read:children',
    'attendance:read:children',
    'fees:read:children'
  ],
  [UserRole.COORDINATOR]: [
    'batches:write',
    'schedules:write',
    'reports:read'
  ]
};

// Authorization Middleware
function authorize(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

### Data Security
```typescript
// Input Validation with Zod
const studentSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+91-\d{10}$/),
  email: z.string().email().optional(),
  parentInfo: z.object({
    name: z.string().min(2),
    phone: z.string().regex(/^\+91-\d{10}$/)
  })
});

// SQL Injection Prevention (Drizzle ORM)
const students = await db
  .select()
  .from(studentsTable)
  .where(eq(studentsTable.batchId, batchId))
  .limit(20)
  .offset(page * 20);

// XSS Prevention
const sanitizeInput = (input: string) => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em'] 
  });
};
```

## Performance Architecture

### Frontend Optimization
```typescript
// Code Splitting
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const StudentPortal = lazy(() => import('../pages/StudentPortal'));

// Component Memoization
const StudentCard = memo(({ student }: { student: Student }) => {
  return <div>{student.name}</div>;
});

// Virtual Scrolling for Large Lists
import { FixedSizeList as List } from 'react-window';

const StudentList = ({ students }: { students: Student[] }) => (
  <List height={400} itemCount={students.length} itemSize={80}>
    {({ index, style }) => (
      <div style={style}>
        <StudentCard student={students[index]} />
      </div>
    )}
  </List>
);
```

### Backend Optimization
```typescript
// Database Query Optimization
// 1. Use proper indexes
// 2. Implement pagination
// 3. Use select only needed fields
// 4. Implement query result caching

const getStudentsByBatch = async (batchId: string, page: number = 0) => {
  return await db
    .select({
      id: students.id,
      name: students.name,
      phone: students.phone,
      isActive: students.isActive
    })
    .from(students)
    .where(and(
      eq(students.batchId, batchId),
      eq(students.isActive, true)
    ))
    .limit(20)
    .offset(page * 20)
    .orderBy(students.name);
};

// API Response Caching
const cache = new Map();

const getCachedResponse = (key: string, ttl: number = 300000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const cachedData = cache.get(key);
    if (cachedData && Date.now() - cachedData.timestamp < ttl) {
      return res.json(cachedData.data);
    }
    next();
  };
};
```

### Caching Strategy
```typescript
// Multi-level Caching
interface CacheStrategy {
  Level1: "Browser Cache (Static Assets)";
  Level2: "CDN Cache (Public Resources)";
  Level3: "Application Cache (API Responses)";
  Level4: "Database Query Cache";
}

// Implementation
const cacheConfig = {
  static: {
    maxAge: '1y',
    immutable: true
  },
  api: {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 600 // 10 minutes
  },
  database: {
    queryCache: true,
    cacheSize: '256MB'
  }
};
```

## Scalability Architecture

### Horizontal Scaling
```typescript
// Microservices Preparation
interface ServiceArchitecture {
  AuthService: "User authentication & authorization";
  StudentService: "Student management operations";
  AttendanceService: "Attendance tracking";
  NotificationService: "Communication & messaging";
  FileService: "Document processing & storage";
  AnalyticsService: "Reporting & analytics";
}

// Load Balancing Strategy
const loadBalancer = {
  algorithm: 'round-robin',
  healthCheck: '/health',
  instances: [
    'app-server-1:3000',
    'app-server-2:3000',
    'app-server-3:3000'
  ]
};
```

### Database Scaling
```sql
-- Read Replicas for Query Distribution
-- Primary (Write): user-data-write.postgres.com
-- Replica 1 (Read): user-data-read-1.postgres.com
-- Replica 2 (Read): user-data-read-2.postgres.com

-- Partitioning Strategy for Large Tables
CREATE TABLE attendance_2024 PARTITION OF attendance
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE attendance_2025 PARTITION OF attendance
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Indexing for Performance
CREATE INDEX CONCURRENTLY idx_attendance_student_date 
ON attendance(student_id, date) 
WHERE date >= '2024-01-01';
```

## Monitoring & Observability

### Application Monitoring
```typescript
// Health Check Endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      disk: await checkDiskSpace(),
      memory: process.memoryUsage()
    }
  };
  
  const isHealthy = Object.values(health.checks)
    .every(check => check.status === 'healthy');
  
  res.status(isHealthy ? 200 : 503).json(health);
});

// Performance Metrics
import { register, collectDefaultMetrics, Counter, Histogram } from 'prom-client';

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});
```

### Error Tracking
```typescript
// Structured Logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Error Boundary for React
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Deployment Architecture

### Production Environment
```yaml
# Docker Compose for Production
version: '3.8'
services:
  app:
    image: educonnect:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=educonnect
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### CI/CD Pipeline
```yaml
# GitHub Actions Workflow
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          ssh ${{ secrets.PROD_SERVER }} "
            cd /app &&
            git pull origin main &&
            npm ci --production &&
            npm run build &&
            pm2 restart educonnect
          "
```

This architecture document provides a comprehensive overview of the EduConnect system design, focusing on scalability, maintainability, and performance optimization while maintaining security best practices.