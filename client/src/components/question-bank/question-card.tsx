import { Question, SingleCorrectContent, MultipleCorrectContent, MatrixMatchContent, ComprehensionContent } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { toast } = useToast();

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "Single Correct": return "bg-blue-100 text-blue-800";
      case "Multiple Correct": return "bg-orange-100 text-orange-800";
      case "Matrix Match": return "bg-purple-100 text-purple-800";
      case "Comprehensions": return "bg-indigo-100 text-indigo-800";
      case "Numerical": return "bg-yellow-100 text-yellow-800";
      case "Integer": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Physics": return "bg-blue-100 text-blue-800";
      case "Chemistry": return "bg-green-100 text-green-800";
      case "Mathematics": return "bg-purple-100 text-purple-800";
      case "Biology": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = () => {
    toast({
      title: "Edit Question",
      description: "Question editing feature coming soon!",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Delete Question",
      description: "Question deletion feature coming soon!",
    });
  };

  const handleAddToExam = () => {
    toast({
      title: "Added to Exam",
      description: "Question added to mock exam builder!",
    });
  };

  const renderSingleCorrect = (content: SingleCorrectContent) => (
    <div className="space-y-3">
      {content.options.map((option, index) => (
        <div
          key={index}
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
            index === content.correctIndex
              ? "bg-green-50 border border-green-200"
              : "hover:bg-neutral-50"
          }`}
        >
          <input
            type="radio"
            name={`q-${question.id}`}
            checked={index === content.correctIndex}
            readOnly
            className={index === content.correctIndex ? "text-green-600 focus:ring-green-500" : "text-primary focus:ring-primary"}
          />
          <span className={index === content.correctIndex ? "text-green-800 font-medium" : "text-neutral-700"}>
            {option}
          </span>
          {index === content.correctIndex && (
            <Check className="text-green-600 ml-auto w-4 h-4" />
          )}
        </div>
      ))}
    </div>
  );

  const renderMultipleCorrect = (content: MultipleCorrectContent) => (
    <div className="space-y-3">
      {content.options.map((option, index) => (
        <div
          key={index}
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
            content.correctIndices.includes(index)
              ? "bg-green-50 border border-green-200"
              : "hover:bg-neutral-50"
          }`}
        >
          <input
            type="checkbox"
            checked={content.correctIndices.includes(index)}
            readOnly
            className={content.correctIndices.includes(index) ? "text-green-600 focus:ring-green-500 rounded" : "text-primary focus:ring-primary rounded"}
          />
          <span className={content.correctIndices.includes(index) ? "text-green-800 font-medium" : "text-neutral-700"}>
            {option}
          </span>
          {content.correctIndices.includes(index) && (
            <Check className="text-green-600 ml-auto w-4 h-4" />
          )}
        </div>
      ))}
    </div>
  );

  const renderMatrixMatch = (content: MatrixMatchContent) => (
    <div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h4 className="font-semibold text-neutral-700 mb-4">Column A</h4>
          <div className="space-y-3">
            {content.columnA.map((item, index) => (
              <div key={index} className="p-3 border border-neutral-300 rounded-lg bg-neutral-50">
                <span className="font-medium text-neutral-800">({item.label})</span>
                <span className="ml-2">{item.content}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-neutral-700 mb-4">Column B</h4>
          <div className="space-y-3">
            {content.columnB.map((item, index) => (
              <div key={index} className="p-3 border border-neutral-300 rounded-lg bg-neutral-50">
                <span className="font-medium text-neutral-800">({item.label})</span>
                <span className="ml-2">{item.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm font-medium text-green-800 mb-2">Correct Answers:</p>
        <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
          {Object.entries(content.correctMatches).map(([key, value]) => (
            <span key={key}>{key} → {value}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderComprehension = (content: ComprehensionContent) => (
    <div>
      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg mb-6">
        <h4 className="font-semibold text-neutral-800 mb-3">Passage:</h4>
        <p className="text-neutral-700 leading-relaxed">{content.passage}</p>
      </div>
      
      <div className="space-y-6">
        {content.questions.map((q, qIndex) => (
          <div key={qIndex}>
            <p className="font-medium text-neutral-800 mb-3">
              Question {qIndex + 1}: {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${
                    oIndex === q.correctIndex
                      ? "bg-green-50 border border-green-200"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`comp-${question.id}-${qIndex}`}
                    checked={oIndex === q.correctIndex}
                    readOnly
                    className={oIndex === q.correctIndex ? "text-green-600 focus:ring-green-500" : "text-primary focus:ring-primary"}
                  />
                  <span className={oIndex === q.correctIndex ? "text-green-800 font-medium" : "text-neutral-700"}>
                    {option}
                  </span>
                  {oIndex === q.correctIndex && (
                    <Check className="text-green-600 ml-auto w-4 h-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestionContent = () => {
    switch (question.questionType) {
      case "Single Correct":
      case "Single Correct - Sec. 2":
        return renderSingleCorrect(question.content as SingleCorrectContent);
      case "Multiple Correct":
        return renderMultipleCorrect(question.content as MultipleCorrectContent);
      case "Matrix Match":
      case "Matrix Match Option":
        return renderMatrixMatch(question.content as MatrixMatchContent);
      case "Comprehensions":
        return renderComprehension(question.content as ComprehensionContent);
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Question type "{question.questionType}" not yet implemented</p>
            <pre className="mt-2 text-xs text-gray-500 overflow-auto">
              {JSON.stringify(question.content, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Badge className={getQuestionTypeColor(question.questionType)}>
            {question.questionType}
          </Badge>
          <Badge className={getSubjectColor(question.subject)}>
            {question.subject}
          </Badge>
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleAddToExam}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="question-content">
        <p className="text-neutral-800 font-medium mb-4">
          {(question.content as any).question}
        </p>
        
        {question.imageUrl && (
          <div className="mb-4">
            <img 
              src={question.imageUrl} 
              alt="Question diagram" 
              className="rounded-lg shadow-sm max-w-full h-auto"
            />
          </div>
        )}
        
        {renderQuestionContent()}
      </div>
      
      {question.explanation && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
          <p className="text-sm text-blue-700">{question.explanation}</p>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>Chapter: {question.chapter} | Topic: {question.topic}</span>
          <span>ID: {question.id.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  );
}
