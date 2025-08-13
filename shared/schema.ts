import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subject: text("subject").notNull(),
  chapter: text("chapter").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(),
  questionType: text("question_type").notNull(),
  content: jsonb("content").notNull(),
  correctAnswer: jsonb("correct_answer").notNull(),
  options: jsonb("options"),
  explanation: text("explanation"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const batches = pgTable("batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  timings: text("timings").notNull(), // e.g., "Mon-Fri 10:00-12:00"
  fees: decimal("fees", { precision: 10, scale: 2 }).notNull(),
  maxStudents: integer("max_students").default(30),
  currentStudents: integer("current_students").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  parentName: text("parent_name").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentEmail: text("parent_email"),
  address: text("address"),
  dateOfBirth: timestamp("date_of_birth"),
  batchId: varchar("batch_id").references(() => batches.id),
  joinDate: timestamp("join_date").defaultNow(),
  isActive: boolean("is_active").default(true),
  emergencyContact: text("emergency_contact"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  batchId: varchar("batch_id").notNull().references(() => batches.id),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // "present", "absent", "late"
  markedBy: varchar("marked_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fees = pgTable("fees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  batchId: varchar("batch_id").notNull().references(() => batches.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  status: text("status").default("pending"), // "pending", "paid", "overdue"
  paymentMethod: text("payment_method"), // "cash", "card", "upi", "bank_transfer"
  receiptNumber: text("receipt_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mockExams = pgTable("mock_exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  duration: integer("duration").notNull(), // in minutes
  totalMarks: integer("total_marks").notNull(),
  questions: jsonb("questions").notNull(), // array of question IDs
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrations = pgTable("integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "google_forms", "google_sheets", "zapier", "make"
  isEnabled: boolean("is_enabled").default(false),
  config: jsonb("config"), // integration-specific configuration
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const questionTypes = [
  "Single Correct",
  "Multiple Correct", 
  "Matrix Match",
  "Matrix Match Option",
  "Comprehensions",
  "Integer",
  "Numerical",
  "3 Column",
  "Paragraph",
  "Column Matching",
  "Single Correct - Sec. 2"
] as const;

export const subjects = ["Physics", "Chemistry", "Mathematics", "Biology"] as const;
export const difficulties = ["Easy", "Medium", "Hard"] as const;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertBatchSchema = createInsertSchema(batches).omit({
  id: true,
  createdAt: true,
  currentStudents: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  joinDate: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertFeeSchema = createInsertSchema(fees).omit({
  id: true,
  createdAt: true,
});

export const insertMockExamSchema = createInsertSchema(mockExams).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Filter schemas
export const questionFilterSchema = z.object({
  subject: z.string().optional(),
  chapter: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  questionType: z.string().optional(),
  search: z.string().optional(),
});

export const studentFilterSchema = z.object({
  batchId: z.string().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

export const attendanceFilterSchema = z.object({
  batchId: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
});

export const feeFilterSchema = z.object({
  batchId: z.string().optional(),
  status: z.string().optional(),
  overdue: z.boolean().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type QuestionFilter = z.infer<typeof questionFilterSchema>;
export type QuestionType = typeof questionTypes[number];
export type Subject = typeof subjects[number];
export type Difficulty = typeof difficulties[number];

export type Batch = typeof batches.$inferSelect;
export type InsertBatch = z.infer<typeof insertBatchSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type StudentFilter = z.infer<typeof studentFilterSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type AttendanceFilter = z.infer<typeof attendanceFilterSchema>;
export type Fee = typeof fees.$inferSelect;
export type InsertFee = z.infer<typeof insertFeeSchema>;
export type FeeFilter = z.infer<typeof feeFilterSchema>;
export type MockExam = typeof mockExams.$inferSelect;
export type InsertMockExam = z.infer<typeof insertMockExamSchema>;
export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

// Question content structures for different types
export interface SingleCorrectContent {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface MultipleCorrectContent {
  question: string;
  options: string[];
  correctIndices: number[];
}

export interface MatrixMatchContent {
  question: string;
  columnA: { label: string; content: string }[];
  columnB: { label: string; content: string }[];
  correctMatches: { [key: string]: string };
}

export interface ComprehensionContent {
  passage: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface NumericalContent {
  question: string;
  correctValue: number;
  tolerance?: number;
}
