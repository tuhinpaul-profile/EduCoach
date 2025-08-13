import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionSchema, questionFilterSchema } from "@shared/schema";
import multer from "multer";
import { parseDocument } from "../client/src/lib/document-parser";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Get question statistics
  app.get("/api/questions/stats", async (req, res) => {
    try {
      const stats = await storage.getQuestionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get subject tree
  app.get("/api/questions/subject-tree", async (req, res) => {
    try {
      const tree = await storage.getSubjectTree();
      res.json(tree);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Upload and parse document
  app.post("/api/questions/upload", upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { subject, chapter, defaultDifficulty } = req.body;
      
      if (!subject || !chapter) {
        return res.status(400).json({ message: "Subject and chapter are required" });
      }

      // Parse the document
      const questions = await parseDocument(req.file.buffer, {
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
      res.status(500).json({ message: "Failed to process document" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
