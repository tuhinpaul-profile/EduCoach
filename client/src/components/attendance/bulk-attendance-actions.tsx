import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkAttendanceActionsProps {
  selectedStudents: string[];
  onClearSelection: () => void;
}

export default function BulkAttendanceActions({ 
  selectedStudents, 
  onClearSelection 
}: BulkAttendanceActionsProps) {
  const { toast } = useToast();

  if (selectedStudents.length === 0) {
    return null;
  }

  const handleBulkAction = (action: string) => {
    toast({
      title: "Attendance Updated",
      description: `Marked ${selectedStudents.length} students as ${action}`,
    });
    onClearSelection();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedStudents.length} students selected
          </span>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={() => handleBulkAction("present")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Present
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => handleBulkAction("absent")}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Mark Absent
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => handleBulkAction("late")}
            >
              <Clock className="w-4 h-4 mr-1" />
              Mark Late
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}