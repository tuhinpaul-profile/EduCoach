# EduConnect - API Documentation

## Overview

The EduConnect API is a RESTful service built with Express.js that provides comprehensive endpoints for education management. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

### Session-Based Authentication
The API uses session-based authentication with PostgreSQL storage.

```javascript
// Authentication header
Cookie: connect.sid=s%3A...
```

### Login Flow
1. Send phone number and role to `/auth/login`
2. Receive OTP via SMS/mock
3. Verify OTP with `/auth/verify-otp`
4. Receive session cookie for subsequent requests

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

## Authentication Endpoints

### POST /auth/login
Initiate login process with phone number and role.

**Request Body:**
```json
{
  "phone": "+91-9876543210",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### POST /auth/verify-otp
Verify OTP and establish session.

**Request Body:**
```json
{
  "phone": "+91-9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+91-9876543210",
    "role": "admin",
    "email": "john@example.com"
  }
}
```

### GET /auth/user
Get current authenticated user.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+91-9876543210",
    "role": "admin",
    "email": "john@example.com"
  }
}
```

### POST /auth/logout
Logout current user and destroy session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Question Bank Endpoints

### GET /questions
Get paginated list of questions with filtering.

**Query Parameters:**
- `subject` (string): Filter by subject
- `chapter` (string): Filter by chapter
- `topic` (string): Filter by topic
- `difficulty` (string): Easy, Medium, Hard
- `questionType` (string): Question type filter
- `search` (string): Text search in question content
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

**Response:**
```json
{
  "questions": [
    {
      "id": "uuid",
      "subject": "Physics",
      "chapter": "Mechanics",
      "topic": "Newton's Laws",
      "difficulty": "Medium",
      "questionType": "Single Correct",
      "content": {
        "question": "What is Newton's first law?",
        "options": ["Law of inertia", "F=ma", "Action-reaction", "None"]
      },
      "correctAnswer": { "index": 0 },
      "explanation": "Newton's first law states...",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

### POST /questions
Create a new question.

**Request Body:**
```json
{
  "subject": "Physics",
  "chapter": "Mechanics",
  "topic": "Newton's Laws",
  "difficulty": "Medium",
  "questionType": "Single Correct",
  "content": {
    "question": "What is Newton's first law?",
    "options": ["Law of inertia", "F=ma", "Action-reaction", "None"]
  },
  "correctAnswer": { "index": 0 },
  "explanation": "Newton's first law states..."
}
```

### PUT /questions/:id
Update existing question.

### DELETE /questions/:id
Delete question by ID.

### GET /questions/stats
Get question bank statistics.

**Response:**
```json
{
  "totalQuestions": 1250,
  "bySubject": {
    "Physics": 300,
    "Chemistry": 250,
    "Mathematics": 400,
    "Biology": 300
  },
  "byDifficulty": {
    "Easy": 400,
    "Medium": 600,
    "Hard": 250
  },
  "byType": {
    "Single Correct": 800,
    "Multiple Correct": 200,
    "Matrix Match": 150,
    "Comprehensions": 100
  }
}
```

### GET /questions/subject-tree
Get hierarchical subject organization.

**Response:**
```json
{
  "Physics": {
    "Mechanics": ["Newton's Laws", "Motion", "Force"],
    "Thermodynamics": ["Heat", "Temperature", "Entropy"]
  },
  "Chemistry": {
    "Organic": ["Hydrocarbons", "Reactions"],
    "Inorganic": ["Metals", "Non-metals"]
  }
}
```

## AI Document Processing

### POST /ai/parse-document
Parse document using AI to extract questions.

**Request (multipart/form-data):**
- `document` (file): Document file (PDF, DOC, DOCX, TXT)
- `subject` (string): Target subject
- `chapter` (string): Target chapter
- `defaultDifficulty` (string): Default difficulty level

**Response:**
```json
{
  "message": "Successfully parsed 15 questions",
  "questions": [
    {
      "subject": "Physics",
      "chapter": "Mechanics",
      "topic": "Force",
      "difficulty": "Medium",
      "questionType": "Single Correct",
      "content": { ... },
      "correctAnswer": { ... }
    }
  ]
}
```

### POST /ai/bulk-upload
Process multiple documents simultaneously.

**Request (multipart/form-data):**
- `documents` (files): Multiple document files
- `subject` (string): Target subject
- `chapter` (string): Target chapter
- `defaultDifficulty` (string): Default difficulty level

## Student Management

### GET /students
Get paginated list of students.

**Query Parameters:**
- `batchId` (string): Filter by batch
- `isActive` (boolean): Filter by active status
- `search` (string): Search by name, phone, or email
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "students": [
    {
      "id": "uuid",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone": "+91-9876543201",
      "parentName": "Robert Johnson",
      "parentPhone": "+91-9876543202",
      "parentEmail": "robert@example.com",
      "address": "123 Main St, City",
      "dateOfBirth": "2005-06-15T00:00:00.000Z",
      "batchId": "batch-uuid",
      "joinDate": "2024-01-15T00:00:00.000Z",
      "isActive": true,
      "emergencyContact": "+91-9876543203",
      "notes": "Excellent student",
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "total": 85,
  "page": 1,
  "totalPages": 5
}
```

### POST /students
Create new student profile.

### PUT /students/:id
Update student information.

### DELETE /students/:id
Deactivate student (soft delete).

## Batch Management

### GET /batches
Get list of all batches.

**Response:**
```json
{
  "batches": [
    {
      "id": "uuid",
      "name": "Physics JEE 2025",
      "subject": "Physics",
      "timings": "Mon-Fri 10:00-12:00",
      "fees": 5000.00,
      "maxStudents": 30,
      "currentStudents": 25,
      "startDate": "2024-06-01T00:00:00.000Z",
      "endDate": "2025-05-31T00:00:00.000Z",
      "isActive": true,
      "createdAt": "2024-05-01T00:00:00.000Z"
    }
  ]
}
```

### POST /batches
Create new batch.

**Request Body:**
```json
{
  "name": "Chemistry NEET 2025",
  "subject": "Chemistry",
  "timings": "Tue-Sat 14:00-16:00",
  "fees": 4500.00,
  "maxStudents": 25,
  "startDate": "2024-07-01T00:00:00.000Z",
  "endDate": "2025-06-30T00:00:00.000Z"
}
```

## Attendance Management

### GET /attendance
Get attendance records with filtering.

**Query Parameters:**
- `batchId` (string): Filter by batch
- `date` (string): Filter by date (YYYY-MM-DD)
- `status` (string): Filter by status
- `studentId` (string): Filter by student

### POST /attendance
Mark attendance for students.

**Request Body:**
```json
{
  "batchId": "batch-uuid",
  "date": "2025-01-15",
  "records": [
    {
      "studentId": "student-uuid-1",
      "status": "present"
    },
    {
      "studentId": "student-uuid-2",
      "status": "absent",
      "notes": "Sick leave"
    }
  ]
}
```

### PUT /attendance/:id
Update attendance record.

### GET /attendance/stats
Get attendance statistics.

**Response:**
```json
{
  "totalDays": 30,
  "presentDays": 27,
  "absentDays": 2,
  "lateDays": 1,
  "attendancePercentage": 90.0,
  "trendData": [
    { "date": "2025-01-01", "present": 25, "absent": 2, "late": 1 }
  ]
}
```

## Fee Management

### GET /fees
Get fee records with filtering.

**Query Parameters:**
- `batchId` (string): Filter by batch
- `status` (string): pending, paid, overdue
- `overdue` (boolean): Show only overdue fees

### POST /fees
Create fee record.

**Request Body:**
```json
{
  "studentId": "student-uuid",
  "batchId": "batch-uuid",
  "amount": 5000.00,
  "dueDate": "2025-02-01T00:00:00.000Z"
}
```

### PUT /fees/:id/pay
Record fee payment.

**Request Body:**
```json
{
  "paymentMethod": "upi",
  "receiptNumber": "RCP2025001",
  "notes": "Paid via Google Pay"
}
```

### GET /fees/stats
Get fee collection statistics.

**Response:**
```json
{
  "totalAmount": 125000.00,
  "collectedAmount": 100000.00,
  "pendingAmount": 20000.00,
  "overdueAmount": 5000.00,
  "collectionPercentage": 80.0
}
```

## Communication & Notifications

### GET /notifications
Get user notifications.

**Query Parameters:**
- `type` (string): message, broadcast, alert, reminder
- `unread` (boolean): Show only unread notifications

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "fromUserId": "sender-uuid",
      "fromUserName": "John Doe",
      "title": "Important Announcement",
      "content": "Classes will be postponed...",
      "type": "broadcast",
      "isRead": false,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "unreadCount": 5
}
```

### POST /notifications
Send notification/message.

**Request Body:**
```json
{
  "title": "Test Results Available",
  "content": "Your test results have been published...",
  "type": "message",
  "recipients": ["user-uuid-1", "user-uuid-2"]
}
```

### PUT /notifications/:id/read
Mark notification as read.

### GET /notifications/unread-count
Get unread notification count.

**Response:**
```json
{
  "count": 5
}
```

## Dashboard Statistics

### GET /dashboard/stats
Get comprehensive dashboard statistics.

**Response:**
```json
{
  "totalStudents": 150,
  "todayAttendance": 135,
  "pendingFees": 25000.00,
  "activeBatches": 8,
  "attendancePercentage": 90.0,
  "feesCollected": 450000.00,
  "monthlyTrends": {
    "attendance": [88, 92, 89, 90],
    "fees": [95000, 100000, 98000, 102000]
  }
}
```

## Mock Exams

### GET /mock-exams
Get list of mock exams.

### POST /mock-exams
Create new mock exam.

**Request Body:**
```json
{
  "title": "Physics Mock Test 1",
  "description": "Comprehensive physics test covering mechanics",
  "subject": "Physics",
  "duration": 180,
  "totalMarks": 100,
  "questions": ["q1-uuid", "q2-uuid", "q3-uuid"]
}
```

### POST /mock-exams/:id/start
Start exam session for student.

### POST /mock-exams/:id/submit
Submit exam answers.

**Request Body:**
```json
{
  "answers": {
    "q1-uuid": { "selectedOption": 0 },
    "q2-uuid": { "selectedOptions": [1, 3] },
    "q3-uuid": { "answer": "42" }
  },
  "timeSpent": 165
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_CREDENTIALS` | Invalid login credentials |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **General API**: 100 requests per minute per user
- **File upload**: 10 requests per hour per user
- **Bulk operations**: 5 requests per hour per user

## Webhooks

### Event Types
- `student.created`
- `student.updated`
- `attendance.marked`
- `fee.paid`
- `exam.completed`

### Webhook Payload
```json
{
  "event": "student.created",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "data": {
    "studentId": "uuid",
    "batchId": "uuid",
    "name": "Alice Johnson"
  }
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const EduConnectAPI = require('@educonnect/api-client');

const client = new EduConnectAPI({
  baseURL: 'https://api.educonnect.com',
  apiKey: 'your-api-key'
});

// Get students
const students = await client.students.list({
  batchId: 'batch-123',
  page: 1
});

// Create question
const question = await client.questions.create({
  subject: 'Physics',
  content: { question: 'What is gravity?' }
});
```

### Python
```python
from educonnect import Client

client = Client(api_key='your-api-key')

# Get dashboard stats
stats = client.dashboard.get_stats()

# Mark attendance
client.attendance.mark({
    'batch_id': 'batch-123',
    'records': [
        {'student_id': 'student-1', 'status': 'present'}
    ]
})
```

## Testing

### Test Environment
```
Base URL: https://test-api.educonnect.com
```

### Test Credentials
```
Admin: +91-9876543210
Teacher: +91-9876543211
Student: +91-9876543212
OTP: Any 6-digit code works in test mode
```

### Postman Collection
A comprehensive Postman collection is available with pre-configured requests and environment variables.