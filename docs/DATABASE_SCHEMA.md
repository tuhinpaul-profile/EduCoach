# EduConnect - Database Schema Documentation

## Overview

The EduConnect database uses PostgreSQL with a normalized schema design optimized for educational institution management. The schema supports role-based access control, hierarchical data organization, and flexible content storage.

## Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    users    │    │    otps     │    │ notifications│
│             │    │             │    │             │
│ • id (PK)   │    │ • id (PK)   │    │ • id (PK)   │
│ • phone     │◄───┤ • phone     │    │ • from_user │───┐
│ • email     │    │ • otp       │    │ • to_user   │   │
│ • name      │    │ • expires_at│    │ • title     │   │
│ • role      │    │ • is_used   │    │ • content   │   │
│ • is_active │    │ • created_at│    │ • type      │   │
│ • last_login│    └─────────────┘    │ • is_read   │   │
│ • created_at│                       │ • created_at│   │
│ • updated_at│                       └─────────────┘   │
└─────────────┘                                         │
       │                                                │
       │        ┌─────────────┐                        │
       └────────┤  batches    │                        │
                │             │                        │
                │ • id (PK)   │                        │
                │ • name      │                        │
                │ • subject   │                        │
                │ • timings   │                        │
                │ • fees      │                        │
                │ • max_stud  │                        │
                │ • curr_stud │                        │
                │ • start_date│                        │
                │ • end_date  │                        │
                │ • is_active │                        │
                │ • created_at│                        │
                └─────────────┘                        │
                       │                               │
                       │                               │
                ┌─────────────┐                        │
                │  students   │                        │
                │             │                        │
                │ • id (PK)   │                        │
                │ • name      │                        │
                │ • email     │                        │
                │ • phone     │                        │
                │ • parent_nm │                        │
                │ • parent_ph │                        │
                │ • parent_em │                        │
                │ • address   │                        │
                │ • dob       │                        │
                │ • batch_id  │────────────────────────┘
                │ • join_date │
                │ • is_active │
                │ • emergency │
                │ • notes     │
                │ • created_at│
                └─────────────┘
                       │
                       │
                ┌─────────────┐
                │ attendance  │
                │             │
                │ • id (PK)   │
                │ • student_id│────────────────────────┘
                │ • batch_id  │
                │ • date      │
                │ • status    │
                │ • marked_by │
                │ • notes     │
                │ • created_at│
                └─────────────┘
```

## Table Definitions

### users
Primary table for all platform users with role-based access control.

```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- 'admin', 'teacher', 'student', 'parent', 'coordinator'
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
```

**Constraints:**
- `phone`: Must be unique, serves as primary authentication identifier
- `role`: ENUM-like constraint for valid roles
- `email`: Optional, used for notifications

### otps
One-time password management for authentication.

```sql
CREATE TABLE otps (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_otps_phone ON otps(phone);
CREATE INDEX idx_otps_expires ON otps(expires_at);
CREATE INDEX idx_otps_used ON otps(is_used);
```

**Business Rules:**
- OTPs expire after 10 minutes
- Only one active OTP per phone number
- Automatic cleanup of expired OTPs

### notifications
System-wide notification and messaging system.

```sql
CREATE TABLE notifications (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id VARCHAR NOT NULL REFERENCES users(id),
    to_user_id VARCHAR REFERENCES users(id), -- NULL for broadcasts
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL, -- 'message', 'broadcast', 'alert', 'reminder'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_to_user ON notifications(to_user_id);
CREATE INDEX idx_notifications_read ON notifications(to_user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

### broadcast_recipients
Tracks recipients for broadcast messages.

```sql
CREATE TABLE broadcast_recipients (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id VARCHAR NOT NULL REFERENCES notifications(id),
    recipient_id VARCHAR NOT NULL REFERENCES users(id),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_broadcast_recipient ON broadcast_recipients(recipient_id);
CREATE INDEX idx_broadcast_notification ON broadcast_recipients(notification_id);
```

### questions
Flexible question storage supporting multiple question types.

```sql
CREATE TABLE questions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL, -- 'Easy', 'Medium', 'Hard'
    question_type TEXT NOT NULL,
    content JSONB NOT NULL, -- Flexible content structure
    correct_answer JSONB NOT NULL,
    options JSONB, -- For MCQ types
    explanation TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_questions_subject ON questions(subject);
CREATE INDEX idx_questions_chapter ON questions(subject, chapter);
CREATE INDEX idx_questions_topic ON questions(subject, chapter, topic);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_content_gin ON questions USING GIN(content);
```

**Question Types Supported:**
- Single Correct
- Multiple Correct
- Matrix Match
- Matrix Match Option
- Comprehensions
- Integer
- Numerical
- 3 Column
- Paragraph
- Column Matching
- Single Correct - Sec. 2

### batches
Class/batch management for student grouping.

```sql
CREATE TABLE batches (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    timings TEXT NOT NULL, -- 'Mon-Fri 10:00-12:00'
    fees DECIMAL(10,2) NOT NULL,
    max_students INTEGER DEFAULT 30,
    current_students INTEGER DEFAULT 0,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_batches_subject ON batches(subject);
CREATE INDEX idx_batches_active ON batches(is_active);
CREATE INDEX idx_batches_dates ON batches(start_date, end_date);
```

### students
Comprehensive student information management.

```sql
CREATE TABLE students (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT,
    address TEXT,
    date_of_birth TIMESTAMP,
    batch_id VARCHAR REFERENCES batches(id),
    join_date TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    emergency_contact TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_students_batch ON students(batch_id);
CREATE INDEX idx_students_phone ON students(phone);
CREATE INDEX idx_students_parent_phone ON students(parent_phone);
CREATE INDEX idx_students_active ON students(is_active);
```

### attendance
Digital attendance tracking system.

```sql
CREATE TABLE attendance (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR NOT NULL REFERENCES students(id),
    batch_id VARCHAR NOT NULL REFERENCES batches(id),
    date TIMESTAMP NOT NULL,
    status TEXT NOT NULL, -- 'present', 'absent', 'late'
    marked_by VARCHAR REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_batch_date ON attendance(batch_id, date);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE UNIQUE INDEX idx_attendance_unique ON attendance(student_id, date);
```

### fees
Fee management and payment tracking.

```sql
CREATE TABLE fees (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR NOT NULL REFERENCES students(id),
    batch_id VARCHAR NOT NULL REFERENCES batches(id),
    amount DECIMAL(10,2) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    paid_date TIMESTAMP,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
    payment_method TEXT, -- 'cash', 'card', 'upi', 'bank_transfer'
    receipt_number TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_fees_student ON fees(student_id);
CREATE INDEX idx_fees_status ON fees(status);
CREATE INDEX idx_fees_due_date ON fees(due_date);
CREATE INDEX idx_fees_batch ON fees(batch_id);
```

### mock_exams
Mock examination management system.

```sql
CREATE TABLE mock_exams (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    total_marks INTEGER NOT NULL,
    questions JSONB NOT NULL, -- array of question IDs
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mock_exams_subject ON mock_exams(subject);
CREATE INDEX idx_mock_exams_active ON mock_exams(is_active);
CREATE INDEX idx_mock_exams_questions_gin ON mock_exams USING GIN(questions);
```

### integrations
External system integration configuration.

```sql
CREATE TABLE integrations (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- 'google_forms', 'google_sheets', 'zapier'
    is_enabled BOOLEAN DEFAULT false,
    config JSONB, -- integration-specific configuration
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_integrations_name ON integrations(name);
CREATE INDEX idx_integrations_enabled ON integrations(is_enabled);
```

## Data Types and Constraints

### UUID Generation
All primary keys use PostgreSQL's `gen_random_uuid()` function for secure, unique identifiers.

### JSON Storage
JSONB fields provide flexibility for:
- Question content structures
- Configuration settings
- Dynamic form data
- Notification metadata

### Timestamp Handling
- All timestamps stored in UTC
- Automatic `created_at` defaults
- Manual `updated_at` management in application layer

### Text Constraints
```sql
-- Example validation constraints
ALTER TABLE users ADD CONSTRAINT valid_role 
    CHECK (role IN ('admin', 'teacher', 'student', 'parent', 'coordinator'));

ALTER TABLE questions ADD CONSTRAINT valid_difficulty 
    CHECK (difficulty IN ('Easy', 'Medium', 'Hard'));

ALTER TABLE attendance ADD CONSTRAINT valid_status 
    CHECK (status IN ('present', 'absent', 'late'));
```

## Performance Optimization

### Indexing Strategy
- Primary key indexes (automatic)
- Foreign key indexes for join performance
- Composite indexes for common query patterns
- GIN indexes for JSONB content search

### Query Optimization Examples
```sql
-- Efficient attendance report query
SELECT s.name, a.status, a.date
FROM students s
JOIN attendance a ON s.id = a.student_id
WHERE a.batch_id = $1 
  AND a.date BETWEEN $2 AND $3
ORDER BY a.date DESC, s.name;

-- Fee summary with proper indexing
SELECT s.name, SUM(f.amount) as total_fees, 
       COUNT(CASE WHEN f.status = 'pending' THEN 1 END) as pending_count
FROM students s
LEFT JOIN fees f ON s.id = f.student_id
WHERE s.batch_id = $1
GROUP BY s.id, s.name;
```

### Connection Pooling
```javascript
// PostgreSQL connection pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Backup and Recovery

### Backup Strategy
```bash
# Daily automated backup
pg_dump educonnect_prod > backup_$(date +%Y%m%d).sql

# Compressed backup for large databases
pg_dump educonnect_prod | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Recovery Procedures
```bash
# Full database restore
psql educonnect_prod < backup_20250101.sql

# Selective table restore
pg_restore -t students backup_20250101.sql
```

## Security Considerations

### Data Encryption
- Passwords stored using bcrypt hashing
- Sensitive data encrypted at rest
- SSL/TLS for data in transit

### Access Control
- Row-level security for multi-tenant data
- Role-based database permissions
- Application-level authorization checks

### Audit Trail
```sql
-- Audit trigger example
CREATE OR REPLACE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log(table_name, operation, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), current_user_id());
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

## Migration Scripts

### Schema Versioning
```sql
-- Version tracking table
CREATE TABLE schema_migrations (
    version VARCHAR PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT NOW()
);

-- Example migration
-- migrations/001_initial_schema.sql
-- migrations/002_add_notifications.sql
-- migrations/003_add_attendance_indexes.sql
```

### Data Migration Examples
```sql
-- Migrate legacy phone format
UPDATE users 
SET phone = CONCAT('+91', SUBSTRING(phone, 2))
WHERE phone LIKE '0%';

-- Update batch current student counts
UPDATE batches 
SET current_students = (
    SELECT COUNT(*) FROM students 
    WHERE batch_id = batches.id AND is_active = true
);
```