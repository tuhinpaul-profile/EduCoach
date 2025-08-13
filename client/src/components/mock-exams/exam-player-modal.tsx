import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Play, Clock, ChevronLeft, ChevronRight, Flag, CheckCircle } from "lucide-react";

interface ExamPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: any;
}

export default function ExamPlayerModal({ isOpen, onClose, exam }: ExamPlayerModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { toast } = useToast();

  // Mock questions for demo
  const questions = [
    {
      id: 1,
      question: "What is the acceleration due to gravity on Earth?",
      options: ["9.8 m/s²", "10 m/s²", "9.5 m/s²", "8.9 m/s²"],
      type: "Single Correct"
    },
    {
      id: 2,
      question: "Which of the following are scalar quantities?",
      options: ["Speed", "Distance", "Mass", "Time"],
      type: "Multiple Correct"
    },
    {
      id: 3,
      question: "Calculate the kinetic energy of a 2kg object moving at 5 m/s",
      type: "Numerical"
    }
  ];

  useEffect(() => {
    if (exam && isOpen && isStarted) {
      setTimeRemaining((exam.duration || 60) * 60); // Convert minutes to seconds
    }
  }, [exam, isOpen, isStarted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && timeRemaining > 0 && !isSubmitted) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isStarted) {
      handleSubmitExam();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, isStarted, isSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setIsStarted(true);
    toast({
      title: "Exam Started",
      description: `You have ${exam.duration} minutes to complete this exam`,
    });
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    toast({
      title: "Exam Submitted",
      description: "Your answers have been submitted successfully",
    });
  };

  const handleClose = () => {
    if (isStarted && !isSubmitted) {
      if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
        setIsStarted(false);
        setCurrentQuestion(0);
        setAnswers({});
        setIsSubmitted(false);
        onClose();
      }
    } else {
      setIsStarted(false);
      setCurrentQuestion(0);
      setAnswers({});
      setIsSubmitted(false);
      onClose();
    }
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / ((exam?.duration || 60) * 60)) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-yellow-600";
    return "text-red-600";
  };

  if (!exam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>{exam.title}</span>
              {isStarted && (
                <Badge className="bg-green-100 text-green-800">
                  In Progress
                </Badge>
              )}
            </div>
            {isStarted && !isSubmitted && (
              <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {!isStarted 
              ? "Review the instructions and start your exam when ready. Make sure you have a stable internet connection."
              : isSubmitted 
              ? "Your exam has been completed and submitted successfully."
              : "Answer each question carefully and manage your time effectively. You can navigate between questions freely."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!isStarted ? (
            // Exam Instructions
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Exam Instructions</h3>
                <div className="space-y-3 text-blue-800">
                  <p>• Duration: {exam.duration} minutes</p>
                  <p>• Total Questions: {questions.length}</p>
                  <p>• Total Marks: {exam.totalMarks}</p>
                  <p>• You can navigate between questions using the navigation buttons</p>
                  <p>• Your progress is automatically saved</p>
                  <p>• Make sure to submit before time runs out</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleStartExam} size="lg" className="px-8">
                  <Play className="w-5 h-5 mr-2" />
                  Start Exam
                </Button>
              </div>
            </div>
          ) : isSubmitted ? (
            // Exam Completed
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Exam Completed!</h3>
                <p className="text-neutral-600">Your answers have been submitted successfully.</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Questions Attempted:</span>
                    <span className="ml-2">{Object.keys(answers).length}/{questions.length}</span>
                  </div>
                  <div>
                    <span className="font-medium">Time Taken:</span>
                    <span className="ml-2">{formatTime((exam.duration * 60) - timeRemaining)}</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          ) : (
            // Exam Interface
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
                </div>
                <Progress value={((currentQuestion + 1) / questions.length) * 100} />
              </div>

              {/* Question */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline">
                        {questions[currentQuestion].type}
                      </Badge>
                      <span className="text-sm text-neutral-500">
                        Question {currentQuestion + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-neutral-900">
                      {questions[currentQuestion].question}
                    </h3>

                    {questions[currentQuestion].options && (
                      <div className="space-y-2">
                        {questions[currentQuestion].options.map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-neutral-50 cursor-pointer">
                            <input
                              type={questions[currentQuestion].type === "Multiple Correct" ? "checkbox" : "radio"}
                              name={`question-${currentQuestion}`}
                              value={option}
                              checked={answers[currentQuestion]?.includes(option)}
                              onChange={(e) => {
                                if (questions[currentQuestion].type === "Multiple Correct") {
                                  const currentAnswers = answers[currentQuestion]?.split(',') || [];
                                  if (e.target.checked) {
                                    handleAnswerChange(currentQuestion, [...currentAnswers, option].join(','));
                                  } else {
                                    handleAnswerChange(currentQuestion, currentAnswers.filter(a => a !== option).join(','));
                                  }
                                } else {
                                  handleAnswerChange(currentQuestion, option);
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {questions[currentQuestion].type === "Numerical" && (
                      <input
                        type="number"
                        placeholder="Enter your answer"
                        value={answers[currentQuestion] || ""}
                        onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Flag className="w-4 h-4 mr-2" />
                    Flag for Review
                  </Button>
                  
                  {currentQuestion === questions.length - 1 ? (
                    <Button onClick={handleSubmitExam} className="bg-green-600 hover:bg-green-700">
                      Submit Exam
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}