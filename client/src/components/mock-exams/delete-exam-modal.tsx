import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: any;
}

export default function DeleteExamModal({ isOpen, onClose, exam }: DeleteExamModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteExamMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/mock-exams/${exam.id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Exam Deleted",
        description: `"${exam.title}" has been deleted successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/mock-exams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mock-exams/stats"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete exam",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteExamMutation.mutate();
  };

  if (!exam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <span>Delete Mock Exam</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 mb-1">
                This action cannot be undone
              </p>
              <p className="text-sm text-red-700">
                This will permanently delete the exam and all associated data including student attempts and results.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-neutral-900">Exam to be deleted:</p>
            <div className="p-3 bg-neutral-50 border rounded-lg">
              <p className="font-medium">{exam.title}</p>
              <p className="text-sm text-neutral-600">{exam.subject}</p>
              <p className="text-xs text-neutral-500">
                {Array.isArray(exam.questions) ? exam.questions.length : 0} questions • {exam.duration} minutes
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteExamMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleteExamMutation.isPending ? "Deleting..." : "Delete Exam"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}