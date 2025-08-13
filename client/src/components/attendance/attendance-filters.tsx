import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttendanceFilter, Batch } from "@shared/schema";

interface AttendanceFiltersProps {
  filters: AttendanceFilter;
  onFilterChange: (filters: AttendanceFilter) => void;
  batches: Batch[];
}

export default function AttendanceFilters({ filters, onFilterChange, batches }: AttendanceFiltersProps) {
  const handleDateChange = (value: string) => {
    onFilterChange({ ...filters, date: value });
  };

  const handleBatchChange = (value: string) => {
    onFilterChange({ ...filters, batchId: value === "all" ? undefined : value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value === "all" ? undefined : value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-neutral-400" />
          <Input
            type="date"
            value={filters.date || ""}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-40"
          />
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

        <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}