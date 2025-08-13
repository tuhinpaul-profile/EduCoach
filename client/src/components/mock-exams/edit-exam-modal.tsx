import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X } from "lucide-react";
import { subjects, Question } from "@shared/schema";

interface EditExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: any;
}

export default function EditExamModal({ isOpen, onClose, exam }: EditExamModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("60");
  const [totalMarks, setTotalMarks] = useState("100");
  const [isActive, setIsActive] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get available questions for selection
  const { data: questions = [] } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
    enabled: isOpen,
  });

  useEffect(() => {
    if (exam && isOpen) {
      setTitle(exam.title || "");
      setDescription(exam.description || "");
      setSubject(exam.subject || "");
      setDuration(String(exam.duration || 60));
      setTotalMarks(String(exam.totalMarks || 100));
      setIsActive(exam.isActive !== false);
      setSelectedQuestions(Array.isArray(exam.questions) ? exam.questions : []);
    }
  }, [exam, isOpen]);

  const updateExamMutation = useMutation({
    mutationFn: async (examData: any) => {
      const response = await apiRequest("PUT", `/api/mock-exams/${exam.id}`, examData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Exam Updated",
        description: `"${title}" has been updated successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/mock-exams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mock-exams/stats"] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update exam",
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
    setIsActive(true);
    setSelectedQuestions([]);
    onClose();
  };

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
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
      isActive,
    };

    updateExamMutation.mutate(examData);
  };

  if (!exam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Edit Mock Exam</span>
          </DialogTitle>
          <DialogDescription>
            Modify exam settings, update questions, and manage exam configuration. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Exam Title *</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter exam title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
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
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter exam description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration (minutes) *</Label>
              <Input
                id="edit-duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-totalMarks">Total Marks *</Label>
              <Input
                id="edit-totalMarks"
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                placeholder="100"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked as boolean)}
                />
                <span className="text-sm">Active</span>
              </div>
            </div>
          </div>

          {/* Question Selection */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-neutral-800 mb-3">
              Selected Questions ({selectedQuestions.length})
            </h4>

            <div className="max-h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
              {questions.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <p>No questions available. Please create some questions first.</p>
                </div>
              ) : (
                questions.map((question) => (
                  <div key={question.id} className="flex items-start space-x-3 p-3 border rounded hover:bg-neutral-50">
                    <Checkbox
                      checked={selectedQuestions.includes(question.id)}
                      onCheckedChange={() => handleQuestionToggle(question.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {question.questionType}
                        </Badge>
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
                <Edit className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Updated Exam Summary</span>
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• {selectedQuestions.length} questions selected</p>
                <p>• Duration: {duration} minutes</p>
                <p>• Total Marks: {totalMarks}</p>
                <p>• Status: {isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 border-t pt-4">
            <Button variant="outline" onClick={handleClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!title || !subject || selectedQuestions.length === 0 || updateExamMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateExamMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}