import OpenAI from "openai";
import { InsertQuestion } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

interface ParseOptions {
  subject: string;
  chapter: string;
  defaultDifficulty: string;
}

export async function parseDocumentWithAI(
  documentText: string,
  options: ParseOptions
): Promise<InsertQuestion[]> {
  if (!openai) {
    throw new Error("OpenAI API key is not configured. Please provide OPENAI_API_KEY environment variable.");
  }
  
  try {
    const prompt = `
You are an expert educational content parser. Parse the following document text and extract questions in JSON format.

DOCUMENT TEXT:
${documentText}

PARSING REQUIREMENTS:
- Subject: ${options.subject}
- Chapter: ${options.chapter}
- Default Difficulty: ${options.defaultDifficulty}

SUPPORTED QUESTION TYPES:
1. Single Correct - One correct answer from multiple options
2. Multiple Correct - Multiple correct answers from options
3. Matrix Match - Match items from two columns
4. Integer - Numerical answer as integer
5. Numerical - Numerical answer with decimals
6. Comprehensions - Questions based on a passage

OUTPUT FORMAT:
Return a JSON object with this structure:
{
  "questions": [
    {
      "subject": "${options.subject}",
      "chapter": "${options.chapter}",
      "topic": "extracted or inferred topic",
      "difficulty": "Easy|Medium|Hard",
      "questionType": "Single Correct|Multiple Correct|Matrix Match|Integer|Numerical|Comprehensions",
      "content": {
        // Structure varies by question type - examples:
        // For Single Correct: {"question": "text", "options": ["A", "B", "C", "D"], "correctIndex": 0}
        // For Multiple Correct: {"question": "text", "options": ["A", "B", "C", "D"], "correctIndices": [0, 2]}
        // For Matrix Match: {"question": "text", "columnA": [...], "columnB": [...], "correctMatches": {...}}
        // For Integer/Numerical: {"question": "text", "correctValue": number}
      },
      "correctAnswer": {
        // Structure varies: {"index": 0} or {"indices": [0,2]} or {"value": 42}
      },
      "explanation": "explanation text if available"
    }
  ]
}

PARSING GUIDELINES:
1. Extract ALL questions found in the document
2. Identify question type based on the format and answer pattern
3. Parse options carefully, maintaining exact text
4. Determine correct answers from the document context
5. Infer difficulty if not explicitly stated
6. Extract explanations when available
7. If topic is not clear, infer from question content
8. Maintain mathematical notation and special characters
9. For images or diagrams mentioned, note them in the question text

Return ONLY the JSON object, no additional text.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content parser that extracts questions from documents and returns them in structured JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temperature for consistent parsing
      max_tokens: 4000
    });

    const result = JSON.parse(response.choices[0].message.content || '{"questions": []}');
    
    // Validate and clean the parsed questions
    const questions: InsertQuestion[] = result.questions.map((q: any) => ({
      subject: q.subject || options.subject,
      chapter: q.chapter || options.chapter,
      topic: q.topic || "General",
      difficulty: q.difficulty || options.defaultDifficulty,
      questionType: q.questionType,
      content: q.content,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || undefined
    }));

    return questions;
  } catch (error) {
    console.error("AI parsing error:", error);
    throw new Error("Failed to parse document with AI: " + (error as Error).message);
  }
}

export async function extractTextFromBuffer(buffer: Buffer, filename: string): Promise<string> {
  // For now, assume it's a text file or simple format
  // In production, you'd use libraries like mammoth for Word docs, pdf-parse for PDFs, etc.
  
  try {
    if (filename.endsWith('.txt')) {
      return buffer.toString('utf-8');
    } else if (filename.endsWith('.docx')) {
      // For Word documents, we'll use a simple approach
      // In production, install and use mammoth: npm install mammoth
      return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r]/g, ' ');
    } else if (filename.endsWith('.pdf')) {
      // For PDFs, you'd use pdf-parse or similar
      return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r]/g, ' ');
    } else {
      // Try to extract text as UTF-8
      return buffer.toString('utf-8');
    }
  } catch (error) {
    console.error("Text extraction error:", error);
    throw new Error("Failed to extract text from document");
  }
}

export async function bulkParseDocuments(
  files: { buffer: Buffer; filename: string }[],
  options: ParseOptions
): Promise<{ filename: string; questions: InsertQuestion[]; error?: string }[]> {
  const results = [];
  
  for (const file of files) {
    try {
      const text = await extractTextFromBuffer(file.buffer, file.filename);
      const questions = await parseDocumentWithAI(text, options);
      results.push({
        filename: file.filename,
        questions,
      });
    } catch (error) {
      results.push({
        filename: file.filename,
        questions: [],
        error: (error as Error).message,
      });
    }
  }
  
  return results;
}