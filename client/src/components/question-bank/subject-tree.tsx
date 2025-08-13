import { useQuery } from "@tanstack/react-query";
import { QuestionFilter } from "@shared/schema";
import { ChevronDown, ChevronRight, Atom, FlaskConical, Calculator, Dna } from "lucide-react";
import { useState } from "react";

interface SubjectTreeProps {
  onFilterChange: (filters: QuestionFilter) => void;
}

export default function SubjectTree({ onFilterChange }: SubjectTreeProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  const { data: tree = {} } = useQuery({
    queryKey: ["/api/questions/subject-tree"],
  });

  const toggleSubject = (subject: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setExpandedSubjects(newExpanded);
  };

  const handleSubjectClick = (subject: string) => {
    onFilterChange({ subject });
  };

  const handleTopicClick = (subject: string, chapter: string, topic: string) => {
    onFilterChange({ subject, chapter, topic });
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "Physics": return <Atom className="text-blue-600" />;
      case "Chemistry": return <FlaskConical className="text-green-600" />;
      case "Mathematics": return <Calculator className="text-purple-600" />;
      case "Biology": return <Dna className="text-red-600" />;
      default: return null;
    }
  };

  const getSubjectCount = (subjectData: any) => {
    return Object.values(subjectData).reduce((total: number, chapters: any) => {
      return total + Object.values(chapters).reduce((chapterTotal: number, topics: any) => {
        return chapterTotal + Object.values(topics).reduce((topicTotal: number, topicData: any) => {
          return topicTotal + (topicData.questionCount || 0);
        }, 0);
      }, 0);
    }, 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Browse by Subject</h3>
      
      <div className="space-y-4">
        {Object.entries(tree).map(([subject, chapters]: [string, any]) => (
          <div key={subject}>
            <button
              onClick={() => {
                toggleSubject(subject);
                handleSubjectClick(subject);
              }}
              className="flex items-center justify-between w-full text-left p-3 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getSubjectIcon(subject)}
                <span className="font-medium text-neutral-800">{subject}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                  {getSubjectCount(chapters)}
                </span>
                {expandedSubjects.has(subject) ? (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                )}
              </div>
            </button>
            
            {expandedSubjects.has(subject) && (
              <div className="ml-6 mt-2 space-y-1">
                {Object.entries(chapters).map(([chapter, topics]: [string, any]) => (
                  <div key={chapter}>
                    <div className="font-medium text-sm text-neutral-700 px-2 py-1">
                      {chapter}
                    </div>
                    {Object.entries(topics).map(([topic, data]: [string, any]) => (
                      <button
                        key={topic}
                        onClick={() => handleTopicClick(subject, chapter, topic)}
                        className="flex justify-between items-center w-full p-2 hover:bg-neutral-50 rounded text-left"
                      >
                        <span className="text-sm text-neutral-600">{topic}</span>
                        <span className="text-xs text-neutral-400">{data.questionCount}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
