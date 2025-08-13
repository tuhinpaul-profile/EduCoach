// Export utilities for downloading exams as PDF and results as Excel

export interface ExamExportData {
  title: string;
  subject: string;
  duration: number;
  totalMarks: number;
  questions: any[];
  instructions?: string[];
}

export interface ResultsExportData {
  examTitle: string;
  attempts: Array<{
    student: string;
    score: number;
    timeTaken: string;
    date: string;
    answers?: any[];
  }>;
  stats: {
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    completionRate: number;
  };
}

// Generate PDF content for exam
export const generateExamPDF = async (examData: ExamExportData): Promise<void> => {
  const { title, subject, duration, totalMarks, questions, instructions } = examData;
  
  // Create a simple HTML structure for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .exam-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .instructions { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
        .question { margin-bottom: 25px; page-break-inside: avoid; }
        .question-header { font-weight: bold; margin-bottom: 10px; }
        .options { margin-left: 20px; }
        .option { margin-bottom: 5px; }
        .answer-space { border-bottom: 1px solid #ccc; height: 30px; margin-top: 10px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p><strong>Subject:</strong> ${subject}</p>
      </div>
      
      <div class="exam-info">
        <div><strong>Duration:</strong> ${duration} minutes</div>
        <div><strong>Total Marks:</strong> ${totalMarks}</div>
        <div><strong>Questions:</strong> ${questions.length}</div>
      </div>
      
      ${instructions ? `
        <div class="instructions">
          <h3>Instructions:</h3>
          <ul>
            ${instructions.map(instruction => `<li>${instruction}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div class="questions">
        ${questions.map((question, index) => `
          <div class="question">
            <div class="question-header">
              Q${index + 1}. ${typeof question.content === 'object' && question.content.question ? question.content.question : 'Question content not available'}
              <span style="float: right;">[${Math.ceil(totalMarks / questions.length)} marks]</span>
            </div>
            
            ${question.options && Array.isArray(question.options) ? `
              <div class="options">
                ${question.options.map((option: string, optIndex: number) => `
                  <div class="option">
                    (${String.fromCharCode(65 + optIndex)}) ${option}
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="answer-space"></div>
            `}
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px;">
        <p><strong>Name:</strong> ___________________________ <strong>Roll No:</strong> ___________</p>
        <p><strong>Date:</strong> ___________________________ <strong>Signature:</strong> ___________</p>
      </div>
    </body>
    </html>
  `;
  
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  }
};

// Generate Excel/CSV content for results
export const generateResultsCSV = (resultsData: ResultsExportData): string => {
  const { examTitle, attempts, stats } = resultsData;
  
  let csvContent = `Exam Results Report\n`;
  csvContent += `Exam Title,${examTitle}\n`;
  csvContent += `Generated on,${new Date().toLocaleDateString()}\n`;
  csvContent += `\n`;
  
  // Summary statistics
  csvContent += `SUMMARY STATISTICS\n`;
  csvContent += `Total Attempts,${stats.totalAttempts}\n`;
  csvContent += `Average Score,${stats.averageScore}%\n`;
  csvContent += `Pass Rate,${stats.passRate}%\n`;
  csvContent += `Completion Rate,${stats.completionRate}%\n`;
  csvContent += `\n`;
  
  // Individual results
  csvContent += `INDIVIDUAL RESULTS\n`;
  csvContent += `Student Name,Score (%),Time Taken,Date,Status\n`;
  
  attempts.forEach(attempt => {
    const status = attempt.score >= 60 ? 'Passed' : 'Failed';
    csvContent += `"${attempt.student}",${attempt.score},${attempt.timeTaken},${attempt.date},${status}\n`;
  });
  
  return csvContent;
};

// Download CSV file
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Generate detailed exam analytics report
export const generateDetailedAnalytics = (resultsData: ResultsExportData): string => {
  const { examTitle, attempts, stats } = resultsData;
  
  // Score distribution analysis
  const scoreRanges = {
    excellent: attempts.filter(a => a.score >= 80).length,
    good: attempts.filter(a => a.score >= 60 && a.score < 80).length,
    needsImprovement: attempts.filter(a => a.score < 60).length
  };
  
  // Time analysis
  const avgTimeMinutes = attempts.reduce((sum, attempt) => {
    const minutes = parseInt(attempt.timeTaken.split(' ')[0]) || 0;
    return sum + minutes;
  }, 0) / attempts.length;
  
  let analyticsContent = `DETAILED ANALYTICS REPORT\n`;
  analyticsContent += `Exam: ${examTitle}\n`;
  analyticsContent += `Report Generated: ${new Date().toLocaleString()}\n`;
  analyticsContent += `${'='.repeat(50)}\n\n`;
  
  analyticsContent += `PERFORMANCE OVERVIEW\n`;
  analyticsContent += `Total Students: ${stats.totalAttempts}\n`;
  analyticsContent += `Average Score: ${stats.averageScore}%\n`;
  analyticsContent += `Highest Score: ${Math.max(...attempts.map(a => a.score))}%\n`;
  analyticsContent += `Lowest Score: ${Math.min(...attempts.map(a => a.score))}%\n`;
  analyticsContent += `Pass Rate: ${stats.passRate}%\n`;
  analyticsContent += `Average Time: ${avgTimeMinutes.toFixed(1)} minutes\n\n`;
  
  analyticsContent += `SCORE DISTRIBUTION\n`;
  analyticsContent += `Excellent (80-100%): ${scoreRanges.excellent} students (${((scoreRanges.excellent/stats.totalAttempts)*100).toFixed(1)}%)\n`;
  analyticsContent += `Good (60-79%): ${scoreRanges.good} students (${((scoreRanges.good/stats.totalAttempts)*100).toFixed(1)}%)\n`;
  analyticsContent += `Needs Improvement (0-59%): ${scoreRanges.needsImprovement} students (${((scoreRanges.needsImprovement/stats.totalAttempts)*100).toFixed(1)}%)\n\n`;
  
  analyticsContent += `TOP PERFORMERS\n`;
  const topPerformers = attempts
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  topPerformers.forEach((performer, index) => {
    analyticsContent += `${index + 1}. ${performer.student} - ${performer.score}% (${performer.timeTaken})\n`;
  });
  
  return analyticsContent;
};

// Export exam question bank as structured JSON
export const exportQuestionBank = (questions: any[]): void => {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalQuestions: questions.length,
    questions: questions.map(q => ({
      id: q.id,
      subject: q.subject,
      chapter: q.chapter,
      topic: q.topic,
      difficulty: q.difficulty,
      questionType: q.questionType,
      content: q.content,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }))
  };
  
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  
  link.href = URL.createObjectURL(blob);
  link.download = `question-bank-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};