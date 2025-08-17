# EduConnect - Data Flow Diagram (DFD)

## Context Diagram (Level 0)

```
                    ┌─────────────────┐
                    │     ADMIN       │
                    │   (Admin &      │
                    │  Coordinator)   │
                    └─────┬───────────┘
                          │
             ┌────────────▼──────────────┐
             │                           │
    ┌────────▼─────────┐        ┌───────▼────────┐
    │     TEACHER      │        │    PARENT      │
    │   (Educator)     │        │  (Guardian)    │
    └────────┬─────────┘        └───────┬────────┘
             │                          │
             │    ┌─────────────────────┴──────────────────────┐
             │    │                                            │
             │    │            EDUCONNECT                      │
             │    │       EDUCATION MANAGEMENT                 │
             │    │            SYSTEM                          │
             │    │                                            │
             │    └─────────────────────┬──────────────────────┘
             │                          │
    ┌────────▼─────────┐        ┌───────▼────────┐
    │     STUDENT      │        │   EXTERNAL     │
    │   (Learner)      │        │    SYSTEMS     │
    └──────────────────┘        │ (SMS, Email,   │
                                │   AI, etc.)    │
                                └────────────────┘
```

## Level 1 DFD - System Overview

```
External Entities:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    ADMIN    │    │   TEACHER   │    │   STUDENT   │    │   PARENT    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       │User Credentials  │Class Data        │Exam Responses    │Child Info Requests
       │System Config     │Attendance Data   │Profile Updates   │Payment Info
       │Reports Request   │Question Data     │                  │
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           EDUCONNECT SYSTEM                            │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    P1       │  │     P2      │  │     P3      │  │     P4      │    │
│  │ User Auth   │  │ Academic    │  │ Financial   │  │ Communication│    │
│  │& Management │  │ Management  │  │ Management  │  │ & Reporting  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
       │                  │                  │                  │
       │Auth Confirmations│Academic Reports  │Payment Status    │Notifications
       │Access Tokens     │Performance Data  │Fee Receipts      │Messages
       │Error Messages    │Attendance Records│Due Alerts        │Reports
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         DATA STORES                                      │
│                                                                          │
│  D1: Users DB    D2: Academic DB    D3: Financial DB    D4: System DB    │
│  • User Profiles • Students Data   • Fee Records      • Notifications   │
│  • Credentials   • Attendance      • Payments         • Messages        │
│  • Sessions      • Questions       • Receipts         • Logs            │
│  • Roles         • Exams           • Due Dates        • Settings        │
│                  • Batches                                               │
└──────────────────────────────────────────────────────────────────────────┘
```

## Level 2 DFD - Process Decomposition

### P1: User Authentication & Management

```
┌─────────────┐
│  USERS      │
│ (All Roles) │
└──────┬──────┘
       │Login Credentials
       │(Phone + Role)
       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   P1.1          │    │   P1.2          │    │   P1.3          │
│ Validate User   │    │ Generate OTP    │    │ Verify OTP      │
│   Credentials   │    │   & Send        │    │ & Create Session│
└─────┬───────────┘    └─────┬───────────┘    └─────┬───────────┘
      │                      │                      │
      │User Lookup           │OTP Request           │Session Data
      ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   D1: Users     │    │  D1: OTP Store  │    │ D1: Sessions    │
│   Database      │    │    (Temp)       │    │    Database     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
      │                      │                      │
      │User Status           │OTP Code              │Session Token
      ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   P1.4          │    │ External SMS    │    │     USER        │
│ Role-Based      │    │   Service       │    │  (Authenticated)│
│ Authorization   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### P2: Academic Management

```
┌─────────────┐
│  TEACHERS   │
└──────┬──────┘
       │Questions, Attendance
       │Exam Data
       ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   P2.1          │         │   P2.2          │         │   P2.3          │
│ Question Bank   │         │ Attendance      │         │ Mock Exam       │
│  Management     │         │  Management     │         │  Management     │
└─────┬───────────┘         └─────┬───────────┘         └─────┬───────────┘
      │                           │                           │
      │Question Data              │Attendance Records         │Exam Data
      ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ D2: Questions   │         │ D2: Attendance  │         │ D2: Mock Exams  │
│   Database      │         │   Database      │         │   Database      │
└─────┬───────────┘         └─────┬───────────┘         └─────┬───────────┘
      │                           │                           │
      │AI Processing              │Attendance Reports         │Exam Results
      ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   P2.4          │         │   P2.5          │         │     P2.6        │
│ AI Document     │         │ Generate        │         │  Performance    │
│  Processing     │         │  Reports        │         │   Analytics     │
└─────┬───────────┘         └─────────────────┘         └─────────────────┘
      │                           │                           │
      │Parsed Questions           │Reports                    │Analytics
      ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────┐               ┌─────────────┐
│ External AI     │         │   ADMIN     │               │  TEACHERS   │
│   Service       │         │  TEACHERS   │               │  STUDENTS   │
│   (OpenAI)      │         │   PARENTS   │               │   PARENTS   │
└─────────────────┘         └─────────────┘               └─────────────┘
```

### P3: Financial Management

```
┌─────────────┐
│   ADMIN     │
│  PARENTS    │
└──────┬──────┘
       │Payment Data
       │Fee Structures
       ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   P3.1          │         │   P3.2          │         │   P3.3          │
│ Fee Structure   │         │ Payment         │         │ Generate        │
│  Management     │         │ Processing      │         │ Receipts        │
└─────┬───────────┘         └─────┬───────────┘         └─────┬───────────┘
      │                           │                           │
      │Fee Data                   │Payment Records            │Receipt Data
      ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ D3: Fee         │         │ D3: Payments    │         │ D3: Receipts    │
│ Structures      │         │   Database      │         │   Database      │
└─────┬───────────┘         └─────┬───────────┘         └─────┬───────────┘
      │                           │                           │
      │Due Calculations           │Payment Status             │Receipt Numbers
      ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   P3.4          │         │   P3.5          │         │   P3.6          │
│ Calculate       │         │ Overdue         │         │ Financial       │
│ Due Amounts     │         │ Management      │         │ Reporting       │
└─────┬───────────┘         └─────┬───────────┘         └─────┬───────────┘
      │                           │                           │
      │Due Alerts                 │Overdue Alerts             │Financial Reports
      ▼                           ▼                           ▼
┌─────────────┐               ┌─────────────┐               ┌─────────────┐
│   PARENTS   │               │   ADMIN     │               │   ADMIN     │
│  STUDENTS   │               │   PARENTS   │               │ MANAGEMENT  │
└─────────────┘               └─────────────┘               └─────────────┘
```

### P4: Communication & Reporting

```
┌─────────────┐
│ ALL USERS   │
│(Send/Receive│
│ Messages)   │
└──────┬──────┘
       │Messages
       │Notifications
       ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   P4.1          │         │   P4.2          │         │   P4.3          │
│ Message         │         │ Notification    │         │ Broadcast       │
│ Management      │         │  Management     │         │ Management      │
└─────┬───────────┘         └─────┬───────────┘         └─────┬───────────┘
      │                           │                           │
      │Personal Messages          │System Notifications       │Announcements
      ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ D4: Messages    │         │ D4: Notifications│         │ D4: Broadcasts  │
│   Database      │         │    Database     │         │   Database      │
└─────┬───────────┘         └─────┬───────────┘         └─────┬───────────┘
      │                           │                           │
      │Message Delivery           │Alert Triggers             │Mass Distribution
      ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   P4.4          │         │   P4.5          │         │   P4.6          │
│ Real-time       │         │ Generate        │         │ Comprehensive   │
│ Delivery        │         │ System Reports  │         │ Reporting       │
└─────┬───────────┘         └─────┬───────────┘         └─────┬───────────┘
      │                           │                           │
      │Live Updates               │System Reports             │Analytics Reports
      ▼                           ▼                           ▼
┌─────────────┐               ┌─────────────┐               ┌─────────────┐
│ ALL USERS   │               │   ADMIN     │               │   ADMIN     │
│(Recipients) │               │ COORDINATORS│               │ MANAGEMENT  │
└─────────────┘               └─────────────┘               └─────────────┘
```

## Data Flow Details by User Role

### Admin Data Flow

```
ADMIN INPUT → SYSTEM PROCESSING → OUTPUT
┌─────────────────┐
│ Admin Actions:  │
│ • User Creation │ → P1 (User Management) → User Accounts Created
│ • Batch Setup   │ → P2 (Academic Mgmt)   → Batches Configured
│ • Fee Structure │ → P3 (Financial Mgmt)  → Fee Rules Established
│ • System Config │ → P4 (Communication)   → System Settings Applied
│ • Reports       │ → All Processes        → Comprehensive Reports
└─────────────────┘
```

### Teacher Data Flow

```
TEACHER INPUT → SYSTEM PROCESSING → OUTPUT
┌─────────────────┐
│ Teacher Actions:│
│ • Attendance    │ → P2.2 (Attendance)    → Attendance Records
│ • Questions     │ → P2.1 (Question Bank) → Question Database
│ • Exams         │ → P2.3 (Mock Exams)    → Exam Results
│ • Messages      │ → P4.1 (Messaging)     → Communications Sent
│ • AI Upload     │ → P2.4 (AI Processing) → Parsed Questions
└─────────────────┘
```

### Student Data Flow

```
STUDENT INPUT → SYSTEM PROCESSING → OUTPUT
┌─────────────────┐
│ Student Actions:│
│ • Login         │ → P1 (Authentication)  → Dashboard Access
│ • Take Exams    │ → P2.3 (Mock Exams)    → Exam Scores
│ • View Records  │ → P2.5 (Reports)       → Personal Analytics
│ • Messages      │ → P4.1 (Messaging)     → Communication
└─────────────────┘
```

### Parent Data Flow

```
PARENT INPUT → SYSTEM PROCESSING → OUTPUT
┌─────────────────┐
│ Parent Actions: │
│ • View Progress │ → P2.6 (Analytics)     → Child's Performance
│ • Fee Payment   │ → P3.2 (Payments)      → Payment Confirmation
│ • Messages      │ → P4.1 (Messaging)     → Teacher Communication
│ • Attendance    │ → P2.2 (Attendance)    → Attendance Reports
└─────────────────┘
```

## Real-time Data Flow

### WebSocket Communication

```
CLIENT EVENTS → WEBSOCKET SERVER → REAL-TIME UPDATES
┌─────────────────┐
│ User Actions:   │
│ • Message Send  │ → Real-time Delivery → Instant Notifications
│ • Attendance    │ → Live Updates      → Parent Notifications
│ • Fee Payment   │ → Payment Updates   → Receipt Generation
│ • Exam Submit   │ → Score Processing  → Result Notifications
└─────────────────┘
```

### Notification Flow

```
TRIGGER EVENT → NOTIFICATION PROCESSOR → DELIVERY CHANNELS
┌─────────────────┐
│ System Events:  │
│ • Student Absent│ → P4.2 (Notifications) → Parent SMS/Email
│ • Fee Due       │ → P4.2 (Notifications) → Payment Reminders
│ • Exam Results  │ → P4.2 (Notifications) → Student/Parent Alert
│ • Announcements │ → P4.3 (Broadcasts)    → All Users
└─────────────────┘
```

## Data Storage Architecture

### Database Relationships

```
USERS ──────┐
            │
            ├── SESSIONS (Authentication)
            │
            ├── MESSAGES (Communication)
            │
            └── NOTIFICATIONS (Alerts)

STUDENTS ───┐
            │
            ├── ATTENDANCE (Academic)
            │
            ├── FEES (Financial)
            │
            └── EXAM_RESULTS (Performance)

BATCHES ────┐
            │
            ├── STUDENTS (Enrollment)
            │
            ├── ATTENDANCE (Class Records)
            │
            └── SCHEDULES (Timing)

QUESTIONS ──┐
            │
            ├── EXAMS (Question Pool)
            │
            └── SUBJECTS (Organization)
```

### Data Validation Flow

```
INPUT DATA → VALIDATION → PROCESSING → STORAGE
┌─────────────────┐
│ Validation:     │
│ • Schema Check  │ → Zod Validation    → Type Safety
│ • Business Rules│ → Logic Validation  → Data Integrity
│ • Permissions   │ → Auth Check        → Security
│ • Sanitization  │ → XSS Prevention    → Safe Storage
└─────────────────┘
```

## Error Handling Flow

```
ERROR OCCURRENCE → ERROR PROCESSING → USER FEEDBACK
┌─────────────────┐
│ Error Types:    │
│ • Validation    │ → Error Logging     → User-Friendly Message
│ • Database      │ → Retry Logic       → System Recovery
│ • Network       │ → Fallback Options  → Graceful Degradation
│ • Permission    │ → Security Alert    → Access Denial
└─────────────────┘
```

This Data Flow Diagram provides a comprehensive view of how information moves through the EduConnect system, showing the interaction between different processes, data stores, and external entities.