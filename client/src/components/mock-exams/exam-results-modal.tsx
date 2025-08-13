import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, Target, Download } from "lucide-react";

interface ExamResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: any;
}

export default function ExamResultsModal({ isOpen, onClose, exam }: ExamResultsModalProps) {
  if (!exam) return null;

  // Mock results data
  const results = {
    totalAttempts: 25,
    averageScore: 72.5,
    passRate: 80,
    topScore: 95,
    lowestScore: 45,
    completionRate: 90,
    recentAttempts: [
      { student: "John Doe", score: 85, time: "45 min", date: "2024-01-20" },
      { student: "Jane Smith", score: 92, time: "38 min", date: "2024-01-20" },
      { student: "Mike Johnson", score: 78, time: "52 min", date: "2024-01-19" },
      { student: "Sarah Wilson", score: 88, time: "41 min", date: "2024-01-19" },
      { student: "David Brown", score: 76, time: "48 min", date: "2024-01-18" },
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Exam Results: {exam.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Total Attempts</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{results.totalAttempts}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Average Score</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{results.averageScore}%</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Pass Rate</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{results.passRate}%</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Completion</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{results.completionRate}%</p>
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Excellent (80-100%)</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2 bg-green-100" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Good (60-79%)</span>
                  <span>25%</span>
                </div>
                <Progress value={25} className="h-2 bg-yellow-100" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Needs Improvement (0-59%)</span>
                  <span>15%</span>
                </div>
                <Progress value={15} className="h-2 bg-red-100" />
              </div>
            </div>
          </div>

          {/* Recent Attempts */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Attempts</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Student</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Score</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Time Taken</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {results.recentAttempts.map((attempt, index) => (
                    <tr key={index} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-neutral-900">{attempt.student}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${getScoreColor(attempt.score)}`}>
                          {attempt.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{attempt.time}</td>
                      <td className="px-4 py-3 text-neutral-600">{attempt.date}</td>
                      <td className="px-4 py-3">
                        <Badge className={
                          attempt.score >= 60 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }>
                          {attempt.score >= 60 ? "Passed" : "Failed"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button>
              View Detailed Analytics
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}