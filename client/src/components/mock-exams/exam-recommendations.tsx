import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  PlayCircle,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { recommendationEngine, generateMockStudentPerformance, type ExamRecommendation } from "@/lib/recommendation-engine";
import { useToast } from "@/hooks/use-toast";

interface ExamRecommendationsProps {
  availableExams: any[];
  onStartExam?: (examId: string) => void;
}

export default function ExamRecommendations({ availableExams, onStartExam }: ExamRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ExamRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const { toast } = useToast();

  useEffect(() => {
    generateRecommendations();
  }, [availableExams]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would fetch actual student performance data
      const studentPerformance = generateMockStudentPerformance();
      
      // Use actual available exams or generate mock data if none available
      const examsToAnalyze = availableExams.length > 0 ? availableExams : [
        {
          id: 'rec-1',
          title: 'Advanced Physics Mock Test',
          subject: 'Physics',
          difficulty: 'Hard',
          duration: 180,
          totalMarks: 300,
          topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism'],
          isActive: true
        },
        {
          id: 'rec-2',
          title: 'Chemistry Fundamentals Assessment',
          subject: 'Chemistry',
          difficulty: 'Medium',
          duration: 120,
          totalMarks: 200,
          topics: ['Organic Chemistry', 'Physical Chemistry'],
          isActive: true
        },
        {
          id: 'rec-3',
          title: 'Mathematics Problem Solving',
          subject: 'Mathematics',
          difficulty: 'Medium',
          duration: 150,
          totalMarks: 250,
          topics: ['Calculus', 'Algebra'],
          isActive: true
        },
        {
          id: 'rec-4',
          title: 'Biology Comprehensive Test',
          subject: 'Biology',
          difficulty: 'Easy',
          duration: 90,
          totalMarks: 150,
          topics: ['Cell Biology', 'Genetics'],
          isActive: true
        }
      ];

      const generatedRecommendations = recommendationEngine.generateRecommendations(
        studentPerformance,
        examsToAnalyze,
        8
      );

      setRecommendations(generatedRecommendations);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => 
    selectedFilter === 'All' || rec.priority === selectedFilter
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Hard': return 'bg-purple-100 text-purple-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Easy': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Exam Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-neutral-600">Analyzing your performance and generating personalized recommendations...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI-Powered Exam Recommendations</span>
          </CardTitle>
          <p className="text-sm text-neutral-600">
            Personalized exam suggestions based on your performance history and learning patterns
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-sm font-medium text-neutral-700">Priority:</span>
            {(['All', 'High', 'Medium', 'Low'] as const).map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                data-testid={`filter-${filter.toLowerCase()}`}
              >
                {filter}
                {filter !== 'All' && (
                  <span className="ml-1 text-xs">
                    ({recommendations.filter(r => r.priority === filter).length})
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.examId} className="relative hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority}
                      </Badge>
                      <Badge className={getDifficultyColor(recommendation.difficulty)}>
                        {recommendation.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                        {Math.round(recommendation.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-neutral-900 leading-tight">
                    {recommendation.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-xs text-neutral-600">
                    <span>{recommendation.subject}</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {recommendation.estimatedDuration}min
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Estimated Score */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-600">Expected Score:</span>
                      <span className="font-medium">{Math.round(recommendation.estimatedScore)}%</span>
                    </div>
                    <Progress value={recommendation.estimatedScore} className="h-2" />
                  </div>

                  {/* Recommendation Reasons */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-1">
                      <Lightbulb className="w-3 h-3 text-amber-500" />
                      <span className="text-xs font-medium text-neutral-700">Why recommended:</span>
                    </div>
                    {recommendation.reasons.slice(0, 2).map((reason, index) => (
                      <p key={index} className="text-xs text-neutral-600 leading-relaxed">
                        • {reason}
                      </p>
                    ))}
                  </div>

                  {/* Topics */}
                  {recommendation.topics.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-neutral-700 mb-1">Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs px-2 py-0">
                            {topic}
                          </Badge>
                        ))}
                        {recommendation.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            +{recommendation.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onStartExam?.(recommendation.examId)}
                      data-testid={`start-exam-${recommendation.examId}`}
                    >
                      <PlayCircle className="w-3 h-3 mr-1" />
                      Start Exam
                    </Button>
                    <Button variant="outline" size="sm">
                      <Target className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>

                {/* Confidence Indicator */}
                <div 
                  className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                    recommendation.confidence >= 0.8 ? 'bg-green-400' :
                    recommendation.confidence >= 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  title={`${Math.round(recommendation.confidence * 100)}% confidence`}
                />
              </Card>
            ))}
          </div>

          {filteredRecommendations.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No recommendations available</h3>
              <p className="text-neutral-600 mb-4">
                {selectedFilter === 'All' 
                  ? "Take a few exams to get personalized recommendations"
                  : `No ${selectedFilter.toLowerCase()} priority recommendations found`
                }
              </p>
              <Button onClick={generateRecommendations} variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Refresh Recommendations
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}