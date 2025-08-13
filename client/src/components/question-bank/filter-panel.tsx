import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QuestionFilter, subjects, questionTypes, difficulties } from "@shared/schema";

interface FilterPanelProps {
  filters: QuestionFilter;
  onFilterChange: (filters: QuestionFilter) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value || undefined });
  };

  const handleSubjectChange = (value: string) => {
    onFilterChange({ ...filters, subject: value === "all" ? undefined : value });
  };

  const handleQuestionTypeChange = (value: string) => {
    onFilterChange({ ...filters, questionType: value === "all" ? undefined : value });
  };

  const handleDifficultyChange = (value: string) => {
    onFilterChange({ ...filters, difficulty: value === "all" ? undefined : value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search questions..."
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        <Select value={filters.subject || "all"} onValueChange={handleSubjectChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.questionType || "all"} onValueChange={handleQuestionTypeChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Question Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Question Types</SelectItem>
            {questionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.difficulty || "all"} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulty</SelectItem>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>
    </div>
  );
}
