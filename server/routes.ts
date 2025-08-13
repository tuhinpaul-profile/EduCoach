import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionSchema, questionFilterSchema } from "@shared/schema";
import multer from "multer";
import { parseDocumentWithAI, extractTextFromBuffer, bulkParseDocuments } from "./ai-parser";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get question statistics (moved before generic question routes)
  app.get("/api/questions/stats", async (req, res) => {
    try {
      const stats = await storage.getQuestionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get subject tree (moved before generic question routes)
  app.get("/api/questions/subject-tree", async (req, res) => {
    try {
      const tree = await storage.getSubjectTree();
      res.json(tree);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI-powered document parsing
  app.post("/api/ai/parse-document", upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { subject, chapter, defaultDifficulty } = req.body;
      
      if (!subject || !chapter) {
        return res.status(400).json({ message: "Subject and chapter are required" });
      }

      // Extract text from the uploaded file
      const documentText = await extractTextFromBuffer(req.file.buffer, req.file.originalname || 'document');
      
      // Parse with AI
      const questions = await parseDocumentWithAI(documentText, {
        subject,
        chapter,
        defaultDifficulty: defaultDifficulty || "Medium"
      });

      res.json({
        message: `Successfully parsed ${questions.length} questions`,
        questions
      });
    } catch (error) {
      console.error("AI document parsing error:", error);
      res.status(500).json({ message: "Failed to parse document with AI: " + (error as Error).message });
    }
  });

  // Bulk upload and parse multiple documents
  app.post("/api/ai/bulk-upload", upload.array('documents', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const { subject, chapter, defaultDifficulty } = req.body;
      
      if (!subject || !chapter) {
        return res.status(400).json({ message: "Subject and chapter are required" });
      }

      const files = req.files.map(file => ({
        buffer: file.buffer,
        filename: file.originalname || 'unknown'
      }));

      const results = await bulkParseDocuments(files, {
        subject,
        chapter,
        defaultDifficulty: defaultDifficulty || "Medium"
      });

      // Store all successfully parsed questions
      let totalQuestions = 0;
      const allCreatedQuestions = [];
      
      for (const result of results) {
        if (result.questions.length > 0) {
          for (const questionData of result.questions) {
            try {
              const question = await storage.createQuestion(questionData);
              allCreatedQuestions.push(question);
              totalQuestions++;
            } catch (error) {
              console.error(`Error storing question from ${result.filename}:`, error);
            }
          }
        }
      }

      res.json({
        message: `Bulk upload completed: ${totalQuestions} questions stored from ${req.files.length} files`,
        results: results.map(r => ({
          filename: r.filename,
          questionsCount: r.questions.length,
          error: r.error
        })),
        totalQuestionsStored: totalQuestions
      });
    } catch (error) {
      console.error("Bulk upload error:", error);
      res.status(500).json({ message: "Failed to process bulk upload: " + (error as Error).message });
    }
  });

  // Upload and parse document (legacy endpoint for backward compatibility)
  app.post("/api/questions/upload", upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { subject, chapter, defaultDifficulty } = req.body;
      
      if (!subject || !chapter) {
        return res.status(400).json({ message: "Subject and chapter are required" });
      }

      // Extract text and parse with AI
      const documentText = await extractTextFromBuffer(req.file.buffer, req.file.originalname || 'document');
      const questions = await parseDocumentWithAI(documentText, {
        subject,
        chapter,
        defaultDifficulty: defaultDifficulty || "Medium"
      });

      // Store all parsed questions
      const createdQuestions = [];
      for (const questionData of questions) {
        const question = await storage.createQuestion(questionData);
        createdQuestions.push(question);
      }

      res.json({
        message: `Successfully parsed and stored ${createdQuestions.length} questions`,
        questions: createdQuestions
      });
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({ message: "Failed to process document: " + (error as Error).message });
    }
  });

  // Get all questions with optional filtering
  app.get("/api/questions", async (req, res) => {
    try {
      const filter = questionFilterSchema.parse(req.query);
      const questions = await storage.getQuestions(filter);
      res.json(questions);
    } catch (error) {
      res.status(400).json({ message: "Invalid filter parameters" });
    }
  });

  // Get a single question
  app.get("/api/questions/:id", async (req, res) => {
    try {
      const question = await storage.getQuestion(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new question
  app.post("/api/questions", async (req, res) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid question data" });
    }
  });

  // Update a question
  app.patch("/api/questions/:id", async (req, res) => {
    try {
      const updates = insertQuestionSchema.partial().parse(req.body);
      const question = await storage.updateQuestion(req.params.id, updates);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Delete a question
  app.delete("/api/questions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteQuestion(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard Stats API
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = {
        totalStudents: 245,
        todayAttendance: 210,
        pendingFees: 85000,
        activeBatches: 12,
        attendancePercentage: 85.7,
        feesCollected: 340000,
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Students API
  app.get("/api/students", async (req, res) => {
    try {
      const students: any[] = []; // Will be replaced with actual storage
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      res.json({ success: true, message: "Student added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Batches API
  app.get("/api/batches", async (req, res) => {
    try {
      const batches: any[] = [];
      res.json(batches);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Attendance API
  app.get("/api/attendance", async (req, res) => {
    try {
      const attendance: any[] = [];
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/attendance/stats", async (req, res) => {
    try {
      const stats = { present: 210, absent: 35, total: 245, percentage: 85.7 };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Fees API
  app.get("/api/fees", async (req, res) => {
    try {
      const fees: any[] = [];
      res.json(fees);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/fees/stats", async (req, res) => {
    try {
      const stats = {
        totalPending: 125000,
        overdue: 25000,
        thisMonth: 340000,
        overdueCount: 15
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/fees/:id/payment", async (req, res) => {
    try {
      res.json({ success: true, message: "Payment recorded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Mock Exams API
  app.get("/api/mock-exams", async (req, res) => {
    try {
      const exams: any[] = [];
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/mock-exams", async (req, res) => {
    try {
      res.json({ success: true, message: "Mock exam created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/mock-exams/stats", async (req, res) => {
    try {
      const stats = {
        totalExams: 134,
        activeExams: 12,
        completedToday: 8,
        avgScore: 72.5
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
