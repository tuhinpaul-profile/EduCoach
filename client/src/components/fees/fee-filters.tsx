import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeeFilter, Batch } from "@shared/schema";

interface FeeFiltersProps {
  filters: FeeFilter;
  onFilterChange: (filters: FeeFilter) => void;
  batches: Batch[];
}

export default function FeeFilters({ filters, onFilterChange, batches }: FeeFiltersProps) {
  const handleBatchChange = (value: string) => {
    onFilterChange({ ...filters, batchId: value === "all" ? undefined : value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value === "all" ? undefined : value });
  };

  const handleOverdueChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      overdue: value === "all" ? undefined : value === "overdue" 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
      <div className="flex flex-wrap items-center gap-4">
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.overdue === undefined ? "all" : (filters.overdue ? "overdue" : "current")} 
          onValueChange={handleOverdueChange}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Fees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fees</SelectItem>
            <SelectItem value="current">Current</SelectItem>
            <SelectItem value="overdue">Overdue Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}