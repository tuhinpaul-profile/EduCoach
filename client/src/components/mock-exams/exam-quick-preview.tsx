import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Users, 
  Target, 
  BookOpen, 
  PlayCircle, 
  BarChart3,
  Calendar,
  Trophy
} from "lucide-react";

interface ExamQuickPreviewProps {
  exam: any;
  trigger: React.ReactNode;
  onStartExam?: (examId: string) => void;
  onViewResults?: (examId: string) => void;
}

export default function ExamQuickPreview({ 
  exam, 
  trigger, 
  onStartExam, 
  onViewResults 
}: ExamQuickPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  const showDelay = 300;
  const hideDelay = 100;
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock exam statistics - in a real app, this would come from API
  const examStats = {
    totalAttempts: Math.floor(Math.random() * 50) + 10,
    averageScore: Math.floor(Math.random() * 30) + 60,
    passRate: Math.floor(Math.random() * 40) + 60,
    lastAttempt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    topScore: Math.floor(Math.random() * 20) + 80,
    difficulty: exam.difficulty || 'Medium'
  };

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const previewWidth = 320;
    const previewHeight = 400;
    
    let top = triggerRect.top + window.scrollY - 10;
    let left = triggerRect.right + 10;
    
    // Adjust if preview would go off right edge
    if (left + previewWidth > viewportWidth) {
      left = triggerRect.left - previewWidth - 10;
    }
    
    // Adjust if preview would go off bottom edge
    if (top + previewHeight > viewportHeight + window.scrollY) {
      top = viewportHeight + window.scrollY - previewHeight - 10;
    }
    
    // Adjust if preview would go off top edge
    if (top < window.scrollY) {
      top = window.scrollY + 10;
    }
    
    setPosition({ top, left });
  };

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }
    
    if (!isVisible) {
      showTimeoutRef.current = setTimeout(() => {
        calculatePosition();
        setIsVisible(true);
      }, showDelay);
    }
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  const handlePreviewMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }
  };

  const handlePreviewMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {trigger}
      </div>
      
      {isVisible && (
        <div
          ref={previewRef}
          className="fixed z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{ top: position.top, left: position.left }}
          onMouseEnter={handlePreviewMouseEnter}
          onMouseLeave={handlePreviewMouseLeave}
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-base leading-tight pr-2">
                  {exam.title}
                </CardTitle>
                <Badge className={getDifficultyColor(examStats.difficulty)}>
                  {examStats.difficulty}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-neutral-600">
                <span>{exam.subject}</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {exam.duration || 60}min
                </span>
                <span className="flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  {exam.totalMarks || 100}pts
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-2 rounded border border-blue-100">
                  <div className="flex items-center space-x-1 mb-1">
                    <Users className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">Attempts</span>
                  </div>
                  <p className="text-sm font-bold text-blue-900">{examStats.totalAttempts}</p>
                </div>
                
                <div className="bg-green-50 p-2 rounded border border-green-100">
                  <div className="flex items-center space-x-1 mb-1">
                    <BarChart3 className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-800">Avg Score</span>
                  </div>
                  <p className={`text-sm font-bold ${getScoreColor(examStats.averageScore)}`}>
                    {examStats.averageScore}%
                  </p>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-600">Pass Rate</span>
                    <span className="font-medium">{examStats.passRate}%</span>
                  </div>
                  <Progress value={examStats.passRate} className="h-1.5" />
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Top Score:</span>
                  <span className={`font-medium ${getScoreColor(examStats.topScore)}`}>
                    {examStats.topScore}%
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Last Attempt:</span>
                  <span className="font-medium">{examStats.lastAttempt}</span>
                </div>
              </div>
              
              {/* Exam Details */}
              <div className="border-t pt-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3 text-neutral-500" />
                    <span className="text-neutral-600">
                      {Array.isArray(exam.questions) ? exam.questions.length : 'N/A'} Questions
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span className="text-neutral-600">
                      {exam.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {exam.description && (
                  <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
                    {exam.description}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2 border-t pt-3">
                <Button 
                  size="sm" 
                  className="flex-1 h-8 text-xs"
                  onClick={() => {
                    onStartExam?.(exam.id);
                    setIsVisible(false);
                  }}
                  data-testid={`quick-preview-start-${exam.id}`}
                >
                  <PlayCircle className="w-3 h-3 mr-1" />
                  Start
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-8 text-xs"
                  onClick={() => {
                    onViewResults?.(exam.id);
                    setIsVisible(false);
                  }}
                  data-testid={`quick-preview-results-${exam.id}`}
                >
                  <Trophy className="w-3 h-3 mr-1" />
                  Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}