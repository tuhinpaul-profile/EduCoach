import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Target, 
  Star, 
  Award, 
  Zap, 
  ChevronRight, 
  Medal,
  Crown,
  Sparkles
} from "lucide-react";
import { gamificationEngine, mockUserStats, type Achievement, type Badge as BadgeType } from "@/lib/gamification-system";

interface AchievementsPanelProps {
  className?: string;
}

export default function AchievementsPanel({ className = "" }: AchievementsPanelProps) {
  const [userStats, setUserStats] = useState(mockUserStats);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeType[]>([]);
  const [progressAchievements, setProgressAchievements] = useState<Achievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    // Initialize achievements system
    const newlyUnlockedAchievements = gamificationEngine.updateAchievements(userStats);
    const badges = gamificationEngine.getUnlockedBadges();
    const progress = gamificationEngine.getProgressAchievements();
    const all = gamificationEngine.getAllAchievements();

    setNewlyUnlocked(newlyUnlockedAchievements);
    setUnlockedBadges(badges);
    setProgressAchievements(progress);
    setAllAchievements(all);
  }, [userStats]);

  const levelInfo = gamificationEngine.calculateUserLevel(userStats.totalPoints);

  const renderAchievement = (achievement: Achievement, showProgress = false) => (
    <Card key={achievement.id} className={`relative ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{achievement.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className={`font-medium ${achievement.unlocked ? 'text-yellow-900' : 'text-neutral-900'}`}>
                {achievement.title}
              </h4>
              <Badge className={gamificationEngine.getRarityColor(achievement.rarity)}>
                {achievement.rarity}
              </Badge>
            </div>
            
            <p className={`text-sm mb-2 ${achievement.unlocked ? 'text-yellow-700' : 'text-neutral-600'}`}>
              {achievement.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-3 h-3 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">
                  {achievement.points} points
                </span>
              </div>
              
              {achievement.unlocked && achievement.unlockedAt && (
                <span className="text-xs text-yellow-600">
                  Unlocked {achievement.unlockedAt.toLocaleDateString()}
                </span>
              )}
            </div>

            {showProgress && !achievement.unlocked && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-600">Progress</span>
                  <span className="font-medium">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-1.5"
                />
              </div>
            )}
          </div>
        </div>

        {achievement.unlocked && (
          <div className="absolute top-2 right-2">
            <Medal className="w-4 h-4 text-yellow-600" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Level Progress Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>Level {levelInfo.level}</span>
              </CardTitle>
              <p className="text-purple-100 text-sm">
                {userStats.totalPoints.toLocaleString()} total points
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{unlockedBadges.length}</div>
              <div className="text-xs text-purple-200">Badges Earned</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {levelInfo.level + 1}</span>
              <span>
                {levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP
              </span>
            </div>
            <Progress 
              value={(levelInfo.currentLevelXP / levelInfo.nextLevelXP) * 100} 
              className="bg-purple-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Newly Unlocked Achievements */}
      {newlyUnlocked.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-900">
              <Sparkles className="w-5 h-5" />
              <span>New Achievements!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {newlyUnlocked.slice(0, 3).map(achievement => renderAchievement(achievement))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Achievements Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Achievements & Badges</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="unlocked" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="unlocked" className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Unlocked ({unlockedBadges.length})</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>In Progress ({progressAchievements.length})</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>All ({allAchievements.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="unlocked" className="space-y-4 mt-4">
              {unlockedBadges.length > 0 ? (
                <div className="grid gap-3">
                  {unlockedBadges.slice(0, 6).map(badge => {
                    const achievement = allAchievements.find(a => a.id === badge.achievementId);
                    return achievement ? renderAchievement(achievement) : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No badges yet</h3>
                  <p className="text-neutral-600 mb-4">
                    Complete exams and achieve milestones to earn your first badges!
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-4 mt-4">
              {progressAchievements.length > 0 ? (
                <div className="grid gap-3">
                  {progressAchievements.map(achievement => renderAchievement(achievement, true))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Nothing in progress</h3>
                  <p className="text-neutral-600">
                    Start taking exams to begin working towards achievements!
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-4 mt-4">
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {allAchievements.map(achievement => renderAchievement(achievement, !achievement.unlocked))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Your Stats</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{userStats.totalExamsCompleted}</div>
              <div className="text-xs text-blue-700">Exams Completed</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">{userStats.averageScore.toFixed(1)}%</div>
              <div className="text-xs text-green-700">Average Score</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-900">{userStats.currentStreak}</div>
              <div className="text-xs text-orange-700">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-900">{userStats.perfectScores}</div>
              <div className="text-xs text-purple-700">Perfect Scores</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}