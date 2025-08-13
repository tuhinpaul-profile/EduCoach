import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Filter, Clock } from "lucide-react";
import { subjects, Question } from "@shared/schema";

interface MockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MockExamModal({ isOpen, onClose }: MockExamModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("60");
  const [totalMarks, setTotalMarks] = useState("100");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterChapter, setFilterChapter] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get available questions for selection
  const { data: questions = [] } = useQuery<Question[]>({
    queryKey: ["/api/questions", { 
      subject: filterSubject === "all" ? "" : filterSubject, 
      chapter: filterChapter 
    }],
    enabled: isOpen,
  });

  const createMockExamMutation = useMutation({
    mutationFn: async (examData: any) => {
      const response = await apiRequest("POST", "/api/mock-exams", examData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Mock Exam Created",
        description: `Mock exam "${title}" created successfully with ${selectedQuestions.length} questions`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/mock-exams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mock-exams/stats"] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create mock exam",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setSubject("");
    setDuration("60");
    setTotalMarks("100");
    setSelectedQuestions([]);
    setFilterSubject("all");
    setFilterChapter("");
    onClose();
  };

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAll = () => {
    const allQuestionIds = questions.map(q => q.id);
    setSelectedQuestions(allQuestionIds);
  };

  const handleDeselectAll = () => {
    setSelectedQuestions([]);
  };

  const handleSubmit = () => {
    if (!title || !subject || selectedQuestions.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one question",
        variant: "destructive",
      });
      return;
    }

    const examData = {
      title,
      description,
      subject,
      duration: parseInt(duration),
      totalMarks: parseInt(totalMarks),
      questions: selectedQuestions,
      isActive: true,
    };

    createMockExamMutation.mutate(examData);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "Single Correct":
        return "📝";
      case "Multiple Correct":
        return "☑️";
      case "Matrix Match":
        return "🔗";
      case "Numerical":
        return "🔢";
      default:
        return "❓";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Mock Exam</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                data-testid="input-title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter exam title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger data-testid="select-subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              data-testid="input-description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter exam description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                data-testid="input-duration"
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks *</Label>
              <Input
                data-testid="input-marks"
                id="totalMarks"
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                placeholder="100"
                min="1"
              />
            </div>
          </div>

          {/* Question Filters */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-neutral-800 mb-3 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter Questions
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filter by Subject</Label>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger data-testid="select-filter-subject">
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All subjects</SelectItem>
                    {subjects.map((sub) => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Filter by Chapter</Label>
                <Input
                  data-testid="input-filter-chapter"
                  value={filterChapter}
                  onChange={(e) => setFilterChapter(e.target.value)}
                  placeholder="Enter chapter name"
                />
              </div>
            </div>
          </div>

          {/* Question Selection */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-neutral-800">
                Select Questions ({selectedQuestions.length} selected)
              </h4>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSelectAll}
                  data-testid="button-select-all"
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDeselectAll}
                  data-testid="button-deselect-all"
                >
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
              {questions.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No questions found. Upload some questions first or adjust filters.</p>
                </div>
              ) : (
                questions.map((question) => (
                  <div key={question.id} className="flex items-start space-x-3 p-3 border rounded hover:bg-neutral-50">
                    <Checkbox
                      checked={selectedQuestions.includes(question.id)}
                      onCheckedChange={() => handleQuestionToggle(question.id)}
                      data-testid={`checkbox-question-${question.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm">{getQuestionTypeIcon(question.questionType)}</span>
                        <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                          {question.questionType}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {question.subject} • {question.chapter} • {question.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-800 line-clamp-2">
                        {typeof question.content === 'object' && question.content && 'question' in question.content
                          ? (question.content as any).question
                          : "Question content"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary */}
          {selectedQuestions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Exam Summary</span>
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• {selectedQuestions.length} questions selected</p>
                <p>• Duration: {duration} minutes</p>
                <p>• Total Marks: {totalMarks}</p>
                <p>• Subject: {subject || "Not selected"}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 border-t pt-4">
            <Button variant="outline" onClick={handleClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!title || !subject || selectedQuestions.length === 0 || createMockExamMutation.isPending}
              data-testid="button-create"
            >
              {createMockExamMutation.isPending ? "Creating..." : `Create Exam`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}