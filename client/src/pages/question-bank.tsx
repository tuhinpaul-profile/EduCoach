import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QuestionFilter } from "@shared/schema";
import Sidebar from "@/components/shared/sidebar";
import StatsCards from "@/components/question-bank/stats-cards";
import FilterPanel from "@/components/question-bank/filter-panel";
import SubjectTree from "@/components/question-bank/subject-tree";
import QuestionCard from "@/components/question-bank/question-card";
import UploadModal from "@/components/question-bank/upload-modal";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QuestionBank() {
  const [filters, setFilters] = useState<QuestionFilter>({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["/api/questions", filters],
    enabled: true,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/questions/stats"],
  });

  const handleFilterChange = (newFilters: QuestionFilter) => {
    setFilters(newFilters);
  };

  const handleCreateMockExam = () => {
    toast({
      title: "Mock Exam Creation",
      description: "Mock exam creation feature coming soon!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-neutral-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Question Bank Management</h2>
              <p className="text-neutral-600 mt-1">Upload, organize, and manage questions for mock exams</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-primary text-white hover:bg-blue-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
              <Button 
                onClick={handleCreateMockExam}
                className="bg-secondary text-white hover:bg-green-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Mock Exam
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          <StatsCards stats={stats} />
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <SubjectTree onFilterChange={handleFilterChange} />
            </div>
            
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {questions.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 mb-2">No questions found</h3>
                    <p className="text-neutral-600 mb-6">Upload a document to get started or adjust your filters</p>
                    <Button onClick={() => setIsUploadModalOpen(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your First Document
                    </Button>
                  </div>
                ) : (
                  questions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))
                )}
                
                {questions.length > 0 && (
                  <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
                    <div className="text-sm text-neutral-600">
                      Showing <span className="font-medium">1-{questions.length}</span> of <span className="font-medium">{questions.length}</span> questions
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}
