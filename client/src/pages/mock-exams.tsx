import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/shared/sidebar";
import ExamFilters from "@/components/mock-exams/exam-filters";
import ExamsTable from "@/components/mock-exams/exams-table";
import CreateExamModal from "@/components/mock-exams/create-exam-modal";
import { Button } from "@/components/ui/button";
import { Plus, Download, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MockExams() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const handleExportResults = () => {
    toast({
      title: "Export Started",
      description: "Downloading exam results as Excel file...",
    });
    // Here you would typically trigger a file download
  };

  const { data: exams = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/mock-exams"],
    enabled: true,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/mock-exams/stats"],
  });

  const examStats = {
    totalExams: 134,
    activeExams: 12,
    completedToday: 8,
    avgScore: 72.5
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading mock exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-neutral-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Mock Exams</h2>
              <p className="text-neutral-600 mt-1">Create and manage practice tests from your question bank</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <PlayCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">{examStats.activeExams} Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  <span className="text-blue-700 font-medium">{examStats.avgScore}% Avg Score</span>
                </div>
              </div>
              <Button variant="outline" onClick={handleExportResults} data-testid="button-export">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)} data-testid="button-create-exam">
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <p className="text-sm text-neutral-600">Total Exams</p>
              <p className="text-xl font-bold text-neutral-800">{examStats.totalExams}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <p className="text-sm text-neutral-600">Active Exams</p>
              <p className="text-xl font-bold text-green-600">{examStats.activeExams}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <p className="text-sm text-neutral-600">Completed Today</p>
              <p className="text-xl font-bold text-blue-600">{examStats.completedToday}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <p className="text-sm text-neutral-600">Average Score</p>
              <p className="text-xl font-bold text-purple-600">{examStats.avgScore}%</p>
            </div>
          </div>

          <ExamFilters />
          <ExamsTable exams={exams} />
        </main>
      </div>
      
      <CreateExamModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}