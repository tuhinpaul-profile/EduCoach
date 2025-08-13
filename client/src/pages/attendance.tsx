import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/shared/sidebar";
import AttendanceFilters from "@/components/attendance/attendance-filters";
import AttendanceTable from "@/components/attendance/attendance-table";
import BulkAttendanceActions from "@/components/attendance/bulk-attendance-actions";
import { AttendanceFilter } from "@shared/schema";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

export default function Attendance() {
  const [filters, setFilters] = useState<AttendanceFilter>({
    date: new Date().toISOString().split('T')[0]
  });
  
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const { data: attendance = [], isLoading } = useQuery({
    queryKey: ["/api/attendance", filters],
    enabled: true,
  });

  const { data: batches = [] } = useQuery({
    queryKey: ["/api/batches"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/attendance/stats", filters],
  });

  const todayStats = {
    present: 210,
    absent: 35,
    total: 245,
    percentage: 85.7
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading attendance...</p>
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
              <h2 className="text-2xl font-bold text-neutral-800">Attendance Tracker</h2>
              <p className="text-neutral-600 mt-1">Mark and track student attendance across batches</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">{todayStats.present} Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 font-medium">{todayStats.absent} Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">{todayStats.percentage}% Rate</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <AttendanceFilters 
            filters={filters} 
            onFilterChange={setFilters}
            batches={batches}
          />
          
          <BulkAttendanceActions 
            selectedStudents={selectedStudents}
            onClearSelection={() => setSelectedStudents([])}
          />
          
          <AttendanceTable 
            attendance={attendance}
            selectedStudents={selectedStudents}
            onSelectionChange={setSelectedStudents}
            batches={batches}
          />
        </main>
      </div>
    </div>
  );
}