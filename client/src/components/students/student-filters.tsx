import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentFilter, Batch } from "@shared/schema";

interface StudentFiltersProps {
  filters: StudentFilter;
  onFilterChange: (filters: StudentFilter) => void;
  batches: Batch[];
}

export default function StudentFilters({ filters, onFilterChange, batches }: StudentFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value || undefined });
  };

  const handleBatchChange = (value: string) => {
    onFilterChange({ ...filters, batchId: value === "all" ? undefined : value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, isActive: value === "all" ? undefined : value === "active" });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        <Select value={filters.batchId || "all"} onValueChange={handleBatchChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Batches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.isActive === undefined ? "all" : (filters.isActive ? "active" : "inactive")} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}