import { type User, type InsertUser, type Question, type InsertQuestion, type QuestionFilter } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestion(id: string): Promise<Question | undefined>;
  getQuestions(filter?: QuestionFilter): Promise<Question[]>;
  updateQuestion(id: string, updates: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: string): Promise<boolean>;
  
  // Statistics methods
  getQuestionStats(): Promise<{
    totalQuestions: number;
    totalSubjects: number;
    totalMockExams: number;
    recentUploads: number;
  }>;
  
  getSubjectTree(): Promise<{
    [subject: string]: {
      [chapter: string]: {
        [topic: string]: {
          questionCount: number;
          difficulties: { [difficulty: string]: number };
        };
      };
    };
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questions: Map<string, Question>;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.seedQuestions();
  }

  private seedQuestions() {
    // Add some sample questions for demonstration
    const sampleQuestions: InsertQuestion[] = [
      {
        subject: "Physics",
        chapter: "Mechanics",
        topic: "Kinematics",
        difficulty: "Medium",
        questionType: "Single Correct",
        content: {
          question: "A particle moves along a straight line such that its displacement s at time t is given by s = 6t² - t³. Find the time when the particle comes to rest.",
          options: ["t = 2 seconds", "t = 4 seconds", "t = 6 seconds", "t = 8 seconds"],
          correctIndex: 1
        },
        correctAnswer: { index: 1 },
        explanation: "Velocity v = ds/dt = 12t - 3t². At rest, v = 0, so 12t - 3t² = 0, giving t = 0 or t = 4 seconds."
      },
      {
        subject: "Chemistry",
        chapter: "Chemical Bonding",
        topic: "Types of Bonds",
        difficulty: "Hard",
        questionType: "Multiple Correct",
        content: {
          question: "Which of the following statements about chemical bonding are correct? (Select all that apply)",
          options: [
            "Ionic bonds form between metals and non-metals",
            "Covalent bonds are stronger than ionic bonds",
            "Hydrogen bonds can form between water molecules",
            "All bonds have the same bond energy"
          ],
          correctIndices: [0, 2]
        },
        correctAnswer: { indices: [0, 2] }
      },
      {
        subject: "Mathematics",
        chapter: "Calculus",
        topic: "Derivatives",
        difficulty: "Easy",
        questionType: "Matrix Match",
        content: {
          question: "Match the following mathematical functions with their derivatives:",
          columnA: [
            { label: "P", content: "sin(x)" },
            { label: "Q", content: "x²" },
            { label: "R", content: "ln(x)" },
            { label: "S", content: "eˣ" }
          ],
          columnB: [
            { label: "1", content: "2x" },
            { label: "2", content: "cos(x)" },
            { label: "3", content: "1/x" },
            { label: "4", content: "eˣ" }
          ],
          correctMatches: { "P": "2", "Q": "1", "R": "3", "S": "4" }
        },
        correctAnswer: { matches: { "P": "2", "Q": "1", "R": "3", "S": "4" } }
      },
      {
        subject: "Biology",
        chapter: "Plant Biology",
        topic: "Photosynthesis",
        difficulty: "Medium",
        questionType: "Comprehensions",
        content: {
          passage: "Photosynthesis is a complex biological process that occurs in plants, algae, and some bacteria. During this process, organisms convert light energy, usually from the sun, into chemical energy stored in glucose molecules. The process occurs in two main stages: the light-dependent reactions (occurring in the thylakoids) and the light-independent reactions or Calvin cycle (occurring in the stroma). The overall equation for photosynthesis is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂.",
          questions: [
            {
              question: "Where do the light-dependent reactions occur?",
              options: ["Stroma", "Thylakoids", "Cytoplasm", "Nucleus"],
              correctIndex: 1
            },
            {
              question: "What is the primary product of photosynthesis?",
              options: ["Carbon dioxide", "Water", "Glucose", "Oxygen"],
              correctIndex: 2
            }
          ]
        },
        correctAnswer: { answers: [1, 2] }
      }
    ];

    sampleQuestions.forEach(q => {
      this.createQuestion(q);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phone === phone,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = { 
      ...insertQuestion, 
      id,
      options: insertQuestion.options || null,
      explanation: insertQuestion.explanation || null,
      imageUrl: insertQuestion.imageUrl || null,
      createdAt: new Date()
    };
    this.questions.set(id, question);
    return question;
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestions(filter?: QuestionFilter): Promise<Question[]> {
    let questions = Array.from(this.questions.values());

    if (filter) {
      if (filter.subject) {
        questions = questions.filter(q => q.subject === filter.subject);
      }
      if (filter.chapter) {
        questions = questions.filter(q => q.chapter === filter.chapter);
      }
      if (filter.topic) {
        questions = questions.filter(q => q.topic === filter.topic);
      }
      if (filter.difficulty) {
        questions = questions.filter(q => q.difficulty === filter.difficulty);
      }
      if (filter.questionType) {
        questions = questions.filter(q => q.questionType === filter.questionType);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        questions = questions.filter(q => 
          JSON.stringify(q.content).toLowerCase().includes(searchLower) ||
          q.subject.toLowerCase().includes(searchLower) ||
          q.chapter.toLowerCase().includes(searchLower) ||
          q.topic.toLowerCase().includes(searchLower)
        );
      }
    }

    return questions.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateQuestion(id: string, updates: Partial<InsertQuestion>): Promise<Question | undefined> {
    const existing = this.questions.get(id);
    if (!existing) return undefined;

    const updated: Question = { ...existing, ...updates };
    this.questions.set(id, updated);
    return updated;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    return this.questions.delete(id);
  }

  async getQuestionStats() {
    const questions = Array.from(this.questions.values());
    const subjects = new Set(questions.map(q => q.subject));
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUploads = questions.filter(q => (q.createdAt?.getTime() || 0) > oneWeekAgo.getTime());

    return {
      totalQuestions: questions.length,
      totalSubjects: subjects.size,
      totalMockExams: 134, // Static for now
      recentUploads: recentUploads.length
    };
  }

  async getSubjectTree() {
    const questions = Array.from(this.questions.values());
    const tree: any = {};

    questions.forEach(q => {
      if (!tree[q.subject]) tree[q.subject] = {};
      if (!tree[q.subject][q.chapter]) tree[q.subject][q.chapter] = {};
      if (!tree[q.subject][q.chapter][q.topic]) {
        tree[q.subject][q.chapter][q.topic] = {
          questionCount: 0,
          difficulties: {}
        };
      }

      tree[q.subject][q.chapter][q.topic].questionCount++;
      if (!tree[q.subject][q.chapter][q.topic].difficulties[q.difficulty]) {
        tree[q.subject][q.chapter][q.topic].difficulties[q.difficulty] = 0;
      }
      tree[q.subject][q.chapter][q.topic].difficulties[q.difficulty]++;
    });

    return tree;
  }
}

export const storage = new MemStorage();
