import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const questionFilterSchema = z.object({
  subject: z.string().optional(),
  chapter: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  questionType: z.string().optional(),
  search: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type QuestionFilter = z.infer<typeof questionFilterSchema>;
export type QuestionType = typeof questionTypes[number];
export type Subject = typeof subjects[number];
export type Difficulty = typeof difficulties[number];

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
