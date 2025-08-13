import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/shared/sidebar";
import StudentsTable from "@/components/students/students-table";
import StudentFilters from "@/components/students/student-filters";
import AddStudentModal from "@/components/students/add-student-modal";
import { Button } from "@/components/ui/button";
import { UserPlus, Download } from "lucide-react";
import { StudentFilter } from "@shared/schema";

export default function Students() {
  const [filters, setFilters] = useState<StudentFilter>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["/api/students", filters],
    enabled: true,
  });

  const { data: batches = [] } = useQuery({
    queryKey: ["/api/batches"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading students...</p>
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
              <h2 className="text-2xl font-bold text-neutral-800">Student Management</h2>
              <p className="text-neutral-600 mt-1">Manage student profiles, batch assignments, and contact information</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </header>

        <main className="p-8">
          <StudentFilters 
            filters={filters} 
            onFilterChange={setFilters} 
            batches={batches}
          />
          <StudentsTable students={students} batches={batches} />
        </main>
      </div>
      
      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        batches={batches}
      />
    </div>
  );
}