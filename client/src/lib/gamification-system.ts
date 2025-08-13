// Comprehensive gamification system with achievements, badges, and progress tracking

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exam' | 'study' | 'progress' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: {
    type: 'exam_count' | 'score_threshold' | 'streak' | 'speed' | 'perfect' | 'subject_master' | 'time_spent' | 'milestone';
    target: number;
    subject?: string;
    condition?: any;
  };
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface UserStats {
  totalExamsCompleted: number;
  averageScore: number;
  currentStreak: number;
  bestStreak: number;
  totalStudyTime: number; // in minutes
  perfectScores: number;
  subjectMastery: Record<string, { exams: number; avgScore: number; bestScore: number }>;
  totalPoints: number;
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
}

export interface Badge {
  achievementId: string;
  title: string;
  icon: string;
  rarity: string;
  unlockedAt: Date;
  points: number;
}

export class GamificationEngine {
  private achievements: Achievement[] = [
    // Exam Count Achievements
    {
      id: 'first_exam',
      title: 'First Steps',
      description: 'Complete your first mock exam',
      icon: '🎯',
      category: 'exam',
      rarity: 'common',
      points: 10,
      requirements: { type: 'exam_count', target: 1 },
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'exam_warrior',
      title: 'Exam Warrior',
      description: 'Complete 10 mock exams',
      icon: '⚔️',
      category: 'exam',
      rarity: 'rare',
      points: 50,
      requirements: { type: 'exam_count', target: 10 },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'exam_master',
      title: 'Exam Master',
      description: 'Complete 50 mock exams',
      icon: '👑',
      category: 'exam',
      rarity: 'epic',
      points: 200,
      requirements: { type: 'exam_count', target: 50 },
      unlocked: false,
      progress: 0,
      maxProgress: 50
    },
    {
      id: 'exam_legend',
      title: 'Exam Legend',
      description: 'Complete 100 mock exams',
      icon: '🏆',
      category: 'exam',
      rarity: 'legendary',
      points: 500,
      requirements: { type: 'exam_count', target: 100 },
      unlocked: false,
      progress: 0,
      maxProgress: 100
    },

    // Score-based Achievements
    {
      id: 'first_perfect',
      title: 'Perfect Score',
      description: 'Score 100% on any exam',
      icon: '💯',
      category: 'progress',
      rarity: 'rare',
      points: 75,
      requirements: { type: 'perfect', target: 1 },
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'high_achiever',
      title: 'High Achiever',
      description: 'Maintain an average score of 80% or higher',
      icon: '📚',
      category: 'progress',
      rarity: 'rare',
      points: 100,
      requirements: { type: 'score_threshold', target: 80 },
      unlocked: false,
      progress: 0,
      maxProgress: 80
    },
    {
      id: 'excellence_seeker',
      title: 'Excellence Seeker',
      description: 'Maintain an average score of 90% or higher',
      icon: '⭐',
      category: 'progress',
      rarity: 'epic',
      points: 200,
      requirements: { type: 'score_threshold', target: 90 },
      unlocked: false,
      progress: 0,
      maxProgress: 90
    },

    // Streak Achievements
    {
      id: 'on_fire',
      title: 'On Fire',
      description: 'Complete exams for 5 days in a row',
      icon: '🔥',
      category: 'study',
      rarity: 'rare',
      points: 60,
      requirements: { type: 'streak', target: 5 },
      unlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'unstoppable',
      title: 'Unstoppable',
      description: 'Complete exams for 10 days in a row',
      icon: '💪',
      category: 'study',
      rarity: 'epic',
      points: 150,
      requirements: { type: 'streak', target: 10 },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'dedication_master',
      title: 'Dedication Master',
      description: 'Complete exams for 30 days in a row',
      icon: '💎',
      category: 'study',
      rarity: 'legendary',
      points: 400,
      requirements: { type: 'streak', target: 30 },
      unlocked: false,
      progress: 0,
      maxProgress: 30
    },

    // Subject Mastery Achievements
    {
      id: 'physics_master',
      title: 'Physics Master',
      description: 'Achieve 85% average in 10 Physics exams',
      icon: '🧬',
      category: 'progress',
      rarity: 'epic',
      points: 180,
      requirements: { type: 'subject_master', target: 85, subject: 'Physics' },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'chemistry_master',
      title: 'Chemistry Master',
      description: 'Achieve 85% average in 10 Chemistry exams',
      icon: '⚗️',
      category: 'progress',
      rarity: 'epic',
      points: 180,
      requirements: { type: 'subject_master', target: 85, subject: 'Chemistry' },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'math_master',
      title: 'Mathematics Master',
      description: 'Achieve 85% average in 10 Mathematics exams',
      icon: '🔢',
      category: 'progress',
      rarity: 'epic',
      points: 180,
      requirements: { type: 'subject_master', target: 85, subject: 'Mathematics' },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'biology_master',
      title: 'Biology Master',
      description: 'Achieve 85% average in 10 Biology exams',
      icon: '🧪',
      category: 'progress',
      rarity: 'epic',
      points: 180,
      requirements: { type: 'subject_master', target: 85, subject: 'Biology' },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },

    // Speed Achievements
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Complete an exam in under half the allotted time with 80%+ score',
      icon: '⚡',
      category: 'special',
      rarity: 'rare',
      points: 120,
      requirements: { type: 'speed', target: 50 }, // 50% of time
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },

    // Study Time Achievements
    {
      id: 'dedicated_learner',
      title: 'Dedicated Learner',
      description: 'Spend 10 hours studying',
      icon: '📖',
      category: 'study',
      rarity: 'rare',
      points: 80,
      requirements: { type: 'time_spent', target: 600 }, // 600 minutes
      unlocked: false,
      progress: 0,
      maxProgress: 600
    },

    // Milestone Achievements
    {
      id: 'level_10',
      title: 'Rising Star',
      description: 'Reach Level 10',
      icon: '🌟',
      category: 'progress',
      rarity: 'rare',
      points: 100,
      requirements: { type: 'milestone', target: 10 },
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'level_25',
      title: 'Skilled Practitioner',
      description: 'Reach Level 25',
      icon: '🎖️',
      category: 'progress',
      rarity: 'epic',
      points: 250,
      requirements: { type: 'milestone', target: 25 },
      unlocked: false,
      progress: 0,
      maxProgress: 25
    }
  ];

  updateAchievements(userStats: UserStats): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      const progress = this.calculateAchievementProgress(achievement, userStats);
      achievement.progress = Math.min(progress, achievement.maxProgress);

      if (progress >= achievement.requirements.target) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newlyUnlocked.push(achievement);
      }
    });

    return newlyUnlocked;
  }

  private calculateAchievementProgress(achievement: Achievement, stats: UserStats): number {
    switch (achievement.requirements.type) {
      case 'exam_count':
        return stats.totalExamsCompleted;
      
      case 'score_threshold':
        return stats.averageScore;
      
      case 'streak':
        return stats.currentStreak;
      
      case 'perfect':
        return stats.perfectScores;
      
      case 'subject_master':
        const subject = achievement.requirements.subject;
        if (!subject || !stats.subjectMastery[subject]) return 0;
        const subjectStats = stats.subjectMastery[subject];
        return subjectStats.exams >= 10 && subjectStats.avgScore >= achievement.requirements.target 
          ? achievement.requirements.target 
          : Math.min(subjectStats.avgScore, achievement.requirements.target);
      
      case 'time_spent':
        return stats.totalStudyTime;
      
      case 'milestone':
        return stats.level;
      
      case 'speed':
        // This would be calculated based on specific exam completion data
        return 0; // Would need exam-specific data
      
      default:
        return 0;
    }
  }

  calculateUserLevel(totalPoints: number): { level: number; currentLevelXP: number; nextLevelXP: number } {
    // Level formula: Level = floor(sqrt(totalPoints / 100))
    const level = Math.floor(Math.sqrt(totalPoints / 100)) + 1;
    const currentLevelXP = Math.pow(level - 1, 2) * 100;
    const nextLevelXP = Math.pow(level, 2) * 100;
    
    return {
      level,
      currentLevelXP: totalPoints - currentLevelXP,
      nextLevelXP: nextLevelXP - currentLevelXP
    };
  }

  getUnlockedBadges(): Badge[] {
    return this.achievements
      .filter(achievement => achievement.unlocked)
      .map(achievement => ({
        achievementId: achievement.id,
        title: achievement.title,
        icon: achievement.icon,
        rarity: achievement.rarity,
        unlockedAt: achievement.unlockedAt!,
        points: achievement.points
      }))
      .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }

  getProgressAchievements(): Achievement[] {
    return this.achievements.filter(achievement => !achievement.unlocked && achievement.progress > 0);
  }

  getAllAchievements(): Achievement[] {
    return [...this.achievements];
  }

  getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'exam': return '📝';
      case 'study': return '📚';
      case 'progress': return '📈';
      case 'social': return '👥';
      case 'special': return '⭐';
      default: return '🏆';
    }
  }
}

export const gamificationEngine = new GamificationEngine();

// Generate mock user stats for demonstration
export const generateMockUserStats = (): UserStats => ({
  totalExamsCompleted: 12,
  averageScore: 78.5,
  currentStreak: 3,
  bestStreak: 8,
  totalStudyTime: 450, // minutes
  perfectScores: 2,
  subjectMastery: {
    'Physics': { exams: 5, avgScore: 82, bestScore: 95 },
    'Chemistry': { exams: 4, avgScore: 75, bestScore: 88 },
    'Mathematics': { exams: 3, avgScore: 80, bestScore: 92 }
  },
  totalPoints: 890,
  level: 3,
  experiencePoints: 890,
  experienceToNextLevel: 1600 - 890
});

export const mockUserStats = generateMockUserStats();