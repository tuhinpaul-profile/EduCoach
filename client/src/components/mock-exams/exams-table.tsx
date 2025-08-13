import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Trash2, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExamPlayerModal from "./exam-player-modal";
import ExamResultsModal from "./exam-results-modal";
import EditExamModal from "./edit-exam-modal";
import DeleteExamModal from "./delete-exam-modal";
import ExamQuickPreview from "./exam-quick-preview";

interface ExamsTableProps {
  exams: any[];
}

export default function ExamsTable({ exams }: ExamsTableProps) {
  const { toast } = useToast();
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleStartExam = (exam: any) => {
    setSelectedExam(exam);
    setIsPlayerModalOpen(true);
  };

  const handleViewResults = (exam: any) => {
    setSelectedExam(exam);
    setIsResultsModalOpen(true);
  };

  const handleEditExam = (exam: any) => {
    setSelectedExam(exam);
    setIsEditModalOpen(true);
  };

  const handleDownloadExam = (examId: string, examTitle: string) => {
    const mockExamData = {
      title: examTitle,
      subject: "Physics", 
      duration: 180,
      totalMarks: 300,
      questions: [
        {
          content: { question: "What is the acceleration due to gravity on Earth?" },
          options: ["9.8 m/s²", "10 m/s²", "9.5 m/s²", "8.9 m/s²"]
        },
        {
          content: { question: "Which of the following are scalar quantities?" },
          options: ["Speed", "Distance", "Mass", "Time"]
        }
      ],
      instructions: [
        "Read each question carefully",
        "Mark your answers clearly", 
        "Manage your time effectively",
        "Review your answers before submitting"
      ]
    };

    import('@/lib/export-utils').then(({ generateExamPDF }) => {
      generateExamPDF(mockExamData);
      
      toast({
        title: "Download Started",
        description: `Generating PDF for "${examTitle}"`,
      });
    });
  };

  const handleDeleteExam = (exam: any) => {
    setSelectedExam(exam);
    setIsDeleteModalOpen(true);
  };
  const mockExams = [
    {
      id: "1",
      title: "JEE Advanced Physics Mock Test #15",
      description: "Comprehensive test covering Mechanics and Thermodynamics",
      subject: "Physics",
      duration: 180,
      totalMarks: 300,
      questions: ["q1", "q2", "q3"],
      isActive: true,
      createdAt: new Date("2024-01-15"),
      studentsAttempted: 25,
      averageScore: 72.5
    },
    {
      id: "2", 
      title: "NEET Chemistry Mock Test #12",
      description: "Organic Chemistry focused assessment",
      subject: "Chemistry",
      duration: 120,
      totalMarks: 200,
      questions: ["q4", "q5", "q6"],
      isActive: true,
      createdAt: new Date("2024-01-20"),
      studentsAttempted: 30,
      averageScore: 68.3
    }
  ];

  const displayExams = exams.length > 0 ? exams : mockExams;

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Physics": return "bg-blue-100 text-blue-800";
      case "Chemistry": return "bg-green-100 text-green-800";
      case "Mathematics": return "bg-purple-100 text-purple-800";
      case "Biology": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800">
          Mock Exams ({displayExams.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Exam Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Questions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {displayExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-neutral-900 mb-1">
                      <ExamQuickPreview
                        exam={exam}
                        onStartExam={handleStartExam}
                        onViewResults={handleViewResults}
                        trigger={
                          <span className="cursor-pointer hover:text-blue-600 transition-colors">
                            {exam.title}
                          </span>
                        }
                      />
                    </div>
                    {exam.description && (
                      <div className="text-sm text-neutral-500 max-w-md">
                        {exam.description}
                      </div>
                    )}
                    <div className="text-xs text-neutral-400 mt-1">
                      Created {exam.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getSubjectColor(exam.subject)}>
                    {exam.subject}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900">
                    {exam.duration} minutes
                  </div>
                  <div className="text-xs text-neutral-500">
                    {exam.totalMarks} marks
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-neutral-900">
                    {Array.isArray(exam.questions) ? exam.questions.length : 0} questions
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900">
                    {(exam as any).studentsAttempted || 0} attempts
                  </div>
                  <div className="text-xs text-neutral-500">
                    Avg: {(exam as any).averageScore || 0}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={exam.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {exam.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="Start Exam"
                      onClick={() => handleStartExam(exam)}
                      data-testid={`button-start-${exam.id}`}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="View Results"
                      onClick={() => handleViewResults(exam)}
                      data-testid={`button-results-${exam.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="Edit"
                      onClick={() => handleEditExam(exam)}
                      data-testid={`button-edit-${exam.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="Download"
                      onClick={() => handleDownloadExam(exam.id, exam.title)}
                      data-testid={`button-download-${exam.id}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="Delete"
                      onClick={() => handleDeleteExam(exam)}
                      data-testid={`button-delete-${exam.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <ExamPlayerModal 
        isOpen={isPlayerModalOpen} 
        onClose={() => setIsPlayerModalOpen(false)} 
        exam={selectedExam} 
      />
      
      <ExamResultsModal 
        isOpen={isResultsModalOpen} 
        onClose={() => setIsResultsModalOpen(false)} 
        exam={selectedExam} 
      />
      
      <EditExamModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        exam={selectedExam} 
      />
      
      <DeleteExamModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        exam={selectedExam} 
      />
    </div>
  );
}