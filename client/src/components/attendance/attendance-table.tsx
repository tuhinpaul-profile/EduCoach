import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Attendance, Batch } from "@shared/schema";

interface AttendanceTableProps {
  attendance: Attendance[];
  selectedStudents: string[];
  onSelectionChange: (selected: string[]) => void;
  batches: Batch[];
}

export default function AttendanceTable({ 
  attendance, 
  selectedStudents, 
  onSelectionChange, 
  batches 
}: AttendanceTableProps) {
  const [localAttendance, setLocalAttendance] = useState<any[]>([
    {
      id: "1",
      studentId: "1",
      batchId: "batch-1",
      date: new Date(),
      status: "present",
      student: { name: "Priya Sharma", phone: "+91 9876543210" },
      batch: { name: "Physics Advanced" }
    },
    {
      id: "2",
      studentId: "2", 
      batchId: "batch-1",
      date: new Date(),
      status: "absent",
      student: { name: "Rahul Kumar", phone: "+91 9876543213" },
      batch: { name: "Physics Advanced" }
    }
  ]);

  const displayAttendance = attendance.length > 0 ? attendance : localAttendance;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "absent": return <XCircle className="w-4 h-4 text-red-600" />;
      case "late": return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800";
      case "absent": return "bg-red-100 text-red-800";
      case "late": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setLocalAttendance(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(displayAttendance.map(item => item.studentId));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelect = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      onSelectionChange(selectedStudents.filter(id => id !== studentId));
    } else {
      onSelectionChange([...selectedStudents, studentId]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-800">
            Attendance ({displayAttendance.length} students)
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedStudents.length === displayAttendance.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-neutral-600">Select All</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Select</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {displayAttendance.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedStudents.includes(item.studentId)}
                    onCheckedChange={() => handleSelect(item.studentId)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {(item as any).student?.name || "Student"}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {(item as any).student?.phone || "No phone"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary">
                    {(item as any).batch?.name || "No Batch"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button 
                      variant={item.status === "present" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(item.id, "present")}
                    >
                      Present
                    </Button>
                    <Button 
                      variant={item.status === "absent" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(item.id, "absent")}
                    >
                      Absent
                    </Button>
                    <Button 
                      variant={item.status === "late" ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(item.id, "late")}
                    >
                      Late
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}