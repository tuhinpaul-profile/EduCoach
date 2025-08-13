// Personalized exam recommendation algorithm

export interface StudentPerformance {
  studentId: string;
  examHistory: Array<{
    examId: string;
    subject: string;
    score: number;
    timeTaken: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topics: string[];
    completedAt: Date;
  }>;
  preferredSubjects: string[];
  weakAreas: string[];
  strongAreas: string[];
  averageScore: number;
  studyPattern: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
}

export interface ExamRecommendation {
  examId: string;
  title: string;
  subject: string;
  difficulty: string;
  estimatedScore: number;
  confidence: number;
  reasons: string[];
  priority: 'High' | 'Medium' | 'Low';
  topics: string[];
  estimatedDuration: number;
}

export interface RecommendationWeights {
  subjectPreference: number;
  performanceHistory: number;
  difficultyProgression: number;
  weakAreaImprovement: number;
  recency: number;
}

class RecommendationEngine {
  private defaultWeights: RecommendationWeights = {
    subjectPreference: 0.25,
    performanceHistory: 0.30,
    difficultyProgression: 0.20,
    weakAreaImprovement: 0.15,
    recency: 0.10
  };

  constructor(private customWeights?: Partial<RecommendationWeights>) {
    if (customWeights) {
      this.defaultWeights = { ...this.defaultWeights, ...customWeights };
    }
  }

  // Main recommendation function
  generateRecommendations(
    studentPerformance: StudentPerformance,
    availableExams: any[],
    limit: number = 5
  ): ExamRecommendation[] {
    const recommendations: ExamRecommendation[] = [];

    for (const exam of availableExams) {
      const recommendation = this.calculateRecommendationScore(studentPerformance, exam);
      if (recommendation.confidence > 0.3) { // Only recommend if confidence > 30%
        recommendations.push(recommendation);
      }
    }

    // Sort by confidence and return top recommendations
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  private calculateRecommendationScore(
    student: StudentPerformance,
    exam: any
  ): ExamRecommendation {
    const scores = {
      subjectPreference: this.calculateSubjectPreferenceScore(student, exam),
      performanceHistory: this.calculatePerformanceHistoryScore(student, exam),
      difficultyProgression: this.calculateDifficultyProgressionScore(student, exam),
      weakAreaImprovement: this.calculateWeakAreaImprovementScore(student, exam),
      recency: this.calculateRecencyScore(student, exam)
    };

    const weightedScore = Object.entries(scores).reduce(
      (total, [key, score]) => total + score * this.defaultWeights[key as keyof RecommendationWeights],
      0
    );

    const reasons = this.generateReasons(student, exam, scores);
    const priority = this.calculatePriority(weightedScore, student, exam);
    const estimatedScore = this.estimateStudentScore(student, exam);

    return {
      examId: exam.id,
      title: exam.title,
      subject: exam.subject,
      difficulty: exam.difficulty || this.inferDifficulty(exam),
      estimatedScore,
      confidence: Math.min(weightedScore, 1.0),
      reasons,
      priority,
      topics: exam.topics || [],
      estimatedDuration: exam.duration || 60
    };
  }

  private calculateSubjectPreferenceScore(student: StudentPerformance, exam: any): number {
    const subjectRank = student.preferredSubjects.indexOf(exam.subject);
    if (subjectRank === -1) return 0.3; // Neutral score for non-preferred subjects
    return Math.max(0.5, 1.0 - (subjectRank * 0.15)); // Higher score for more preferred subjects
  }

  private calculatePerformanceHistoryScore(student: StudentPerformance, exam: any): number {
    const subjectHistory = student.examHistory.filter(h => h.subject === exam.subject);
    
    if (subjectHistory.length === 0) return 0.5; // Neutral for new subjects
    
    const avgScore = subjectHistory.reduce((sum, h) => sum + h.score, 0) / subjectHistory.length;
    const recentTrend = this.calculateTrend(subjectHistory.slice(-3));
    
    // Combine average performance with recent trend
    return Math.min(1.0, (avgScore / 100) * 0.7 + recentTrend * 0.3);
  }

  private calculateDifficultyProgressionScore(student: StudentPerformance, exam: any): number {
    const examDifficulty = this.getDifficultyLevel(exam.difficulty || this.inferDifficulty(exam));
    const subjectHistory = student.examHistory.filter(h => h.subject === exam.subject);
    
    if (subjectHistory.length === 0) {
      return examDifficulty === 1 ? 0.8 : 0.4; // Prefer easier exams for new subjects
    }

    const recentPerformance = subjectHistory.slice(-3);
    const avgRecentScore = recentPerformance.reduce((sum, h) => sum + h.score, 0) / recentPerformance.length;
    
    // Recommend appropriate difficulty based on recent performance
    if (avgRecentScore >= 80 && examDifficulty < 3) return 0.9; // Ready for harder
    if (avgRecentScore >= 60 && examDifficulty === 2) return 0.8; // Stay at medium
    if (avgRecentScore < 60 && examDifficulty === 1) return 0.7; // Practice easy
    
    return 0.4; // Lower score for inappropriate difficulty
  }

  private calculateWeakAreaImprovementScore(student: StudentPerformance, exam: any): number {
    const examTopics = exam.topics || [];
    const weakAreaOverlap = examTopics.filter(topic => 
      student.weakAreas.some(weak => weak.toLowerCase().includes(topic.toLowerCase()))
    ).length;
    
    if (weakAreaOverlap === 0) return 0.3;
    return Math.min(1.0, 0.5 + (weakAreaOverlap / examTopics.length) * 0.5);
  }

  private calculateRecencyScore(student: StudentPerformance, exam: any): number {
    const subjectHistory = student.examHistory.filter(h => h.subject === exam.subject);
    
    if (subjectHistory.length === 0) return 0.8; // High score for new subjects
    
    const lastExam = subjectHistory[subjectHistory.length - 1];
    const daysSinceLastExam = Math.floor(
      (Date.now() - lastExam.completedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Optimal frequency: 1-7 days between exams
    if (daysSinceLastExam >= 1 && daysSinceLastExam <= 7) return 0.9;
    if (daysSinceLastExam > 7 && daysSinceLastExam <= 14) return 0.7;
    return 0.4; // Too recent or too old
  }

  private calculateTrend(recentHistory: StudentPerformance['examHistory']): number {
    if (recentHistory.length < 2) return 0.5;
    
    const scores = recentHistory.map(h => h.score);
    const improvement = scores[scores.length - 1] - scores[0];
    
    return Math.min(1.0, Math.max(0.0, 0.5 + improvement / 100));
  }

  private getDifficultyLevel(difficulty: string): number {
    const levels = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    return levels[difficulty as keyof typeof levels] || 2;
  }

  private inferDifficulty(exam: any): string {
    // Infer difficulty from exam duration, marks, or question count
    if (exam.duration > 180 || exam.totalMarks > 300) return 'Hard';
    if (exam.duration < 60 || exam.totalMarks < 100) return 'Easy';
    return 'Medium';
  }

  private generateReasons(
    student: StudentPerformance,
    exam: any,
    scores: Record<string, number>
  ): string[] {
    const reasons: string[] = [];
    
    if (scores.subjectPreference > 0.7) {
      reasons.push(`${exam.subject} is one of your preferred subjects`);
    }
    
    if (scores.performanceHistory > 0.7) {
      reasons.push(`Strong performance history in ${exam.subject}`);
    }
    
    if (scores.weakAreaImprovement > 0.6) {
      reasons.push('Targets your weak areas for improvement');
    }
    
    if (scores.difficultyProgression > 0.7) {
      reasons.push('Appropriate difficulty level for your current skill');
    }
    
    const subjectExams = student.examHistory.filter(h => h.subject === exam.subject);
    const avgScore = subjectExams.length > 0 
      ? subjectExams.reduce((sum, h) => sum + h.score, 0) / subjectExams.length 
      : 0;
    
    if (avgScore > 75) {
      reasons.push('You have been performing well in this subject');
    }
    
    return reasons.length > 0 ? reasons : ['Suitable for your learning goals'];
  }

  private calculatePriority(
    confidence: number,
    student: StudentPerformance,
    exam: any
  ): 'High' | 'Medium' | 'Low' {
    const weakAreaMatch = exam.topics?.some((topic: string) => 
      student.weakAreas.some((weak: string) => weak.toLowerCase().includes(topic.toLowerCase()))
    );
    
    if (confidence > 0.8 || weakAreaMatch) return 'High';
    if (confidence > 0.6) return 'Medium';
    return 'Low';
  }

  private estimateStudentScore(student: StudentPerformance, exam: any): number {
    const subjectHistory = student.examHistory.filter(h => h.subject === exam.subject);
    
    if (subjectHistory.length === 0) {
      return Math.max(40, student.averageScore - 10); // Conservative estimate
    }
    
    const subjectAvg = subjectHistory.reduce((sum, h) => sum + h.score, 0) / subjectHistory.length;
    const recentTrend = this.calculateTrend(subjectHistory.slice(-3));
    
    // Adjust based on difficulty
    const difficultyAdjustment = this.getDifficultyLevel(exam.difficulty || this.inferDifficulty(exam));
    const adjustment = (3 - difficultyAdjustment) * 5; // -5 to +10 points
    
    return Math.min(100, Math.max(0, subjectAvg + (recentTrend - 0.5) * 20 + adjustment));
  }

  // Adaptive learning recommendations
  generateStudyPlan(
    student: StudentPerformance,
    targetExams: string[],
    timeframe: number
  ): Array<{
    week: number;
    recommendations: ExamRecommendation[];
    focusAreas: string[];
    studyTime: number;
  }> {
    const weeks = Math.ceil(timeframe / 7);
    const studyPlan = [];
    
    for (let week = 1; week <= weeks; week++) {
      const weekPlan = {
        week,
        recommendations: [], // Would be populated with exam recommendations
        focusAreas: this.identifyWeeklyFocus(student, week, weeks),
        studyTime: this.calculateOptimalStudyTime(student)
      };
      studyPlan.push(weekPlan);
    }
    
    return studyPlan;
  }

  private identifyWeeklyFocus(student: StudentPerformance, week: number, totalWeeks: number): string[] {
    const weakAreas = student.weakAreas.slice(0, 3); // Top 3 weak areas
    const weeklyFocus = [];
    
    if (week <= totalWeeks * 0.4) {
      // Early weeks: Focus on weak areas
      weeklyFocus.push(...weakAreas);
    } else if (week <= totalWeeks * 0.8) {
      // Middle weeks: Balance weak and strong areas
      weeklyFocus.push(...weakAreas.slice(0, 2));
      weeklyFocus.push(...student.strongAreas.slice(0, 1));
    } else {
      // Final weeks: Review and practice
      weeklyFocus.push('Comprehensive Review', 'Mock Tests');
    }
    
    return weeklyFocus;
  }

  private calculateOptimalStudyTime(student: StudentPerformance): number {
    // Base study time on average score and performance trend
    const baseTime = 120; // 2 hours
    const performanceMultiplier = student.averageScore < 60 ? 1.5 : 
                                student.averageScore < 80 ? 1.2 : 1.0;
    
    return Math.round(baseTime * performanceMultiplier);
  }
}

export const recommendationEngine = new RecommendationEngine();

// Helper functions for mock data generation
export const generateMockStudentPerformance = (): StudentPerformance => ({
  studentId: 'student-123',
  examHistory: [
    {
      examId: 'exam-1',
      subject: 'Physics',
      score: 78,
      timeTaken: 120,
      difficulty: 'Medium',
      topics: ['Mechanics', 'Thermodynamics'],
      completedAt: new Date('2024-01-15')
    },
    {
      examId: 'exam-2',
      subject: 'Chemistry',
      score: 65,
      timeTaken: 90,
      difficulty: 'Easy',
      topics: ['Organic Chemistry', 'Reactions'],
      completedAt: new Date('2024-01-20')
    }
  ],
  preferredSubjects: ['Physics', 'Mathematics', 'Chemistry'],
  weakAreas: ['Organic Chemistry', 'Complex Numbers'],
  strongAreas: ['Mechanics', 'Algebra'],
  averageScore: 72,
  studyPattern: 'Evening'
});