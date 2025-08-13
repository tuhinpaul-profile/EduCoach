import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Mail, Phone } from "lucide-react";
import { Student, Batch } from "@shared/schema";

interface StudentsTableProps {
  students: Student[];
  batches: Batch[];
}

export default function StudentsTable({ students, batches }: StudentsTableProps) {
  // Mock data for demonstration
  const mockStudents: Student[] = [
    {
      id: "1",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 9876543210",
      parentName: "Raj Sharma",
      parentPhone: "+91 9876543211",
      parentEmail: "raj.sharma@email.com",
      address: "123 MG Road, Mumbai",
      dateOfBirth: new Date("2005-03-15"),
      batchId: "batch-1",
      joinDate: new Date("2024-01-15"),
      isActive: true,
      emergencyContact: "+91 9876543212",
      notes: "Excellent student",
      createdAt: new Date(),
    },
    {
      id: "2", 
      name: "Rahul Kumar",
      email: "rahul.kumar@email.com",
      phone: "+91 9876543213",
      parentName: "Suresh Kumar",
      parentPhone: "+91 9876543214",
      parentEmail: "suresh.kumar@email.com",
      address: "456 Park Street, Delhi",
      dateOfBirth: new Date("2005-07-22"),
      batchId: "batch-2",
      joinDate: new Date("2024-02-01"),
      isActive: true,
      emergencyContact: "+91 9876543215",
      notes: "Good in mathematics",
      createdAt: new Date(),
    }
  ];

  const mockBatches: Batch[] = [
    {
      id: "batch-1",
      name: "Physics Advanced",
      subject: "Physics",
      timings: "Mon-Fri 10:00-12:00",
      fees: 5000,
      maxStudents: 30,
      currentStudents: 25,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-06-30"),
      isActive: true,
      createdAt: new Date(),
    }
  ];

  const displayStudents = students.length > 0 ? students : mockStudents;
  const displayBatches = batches.length > 0 ? batches : mockBatches;

  const getBatchName = (batchId: string | null) => {
    if (!batchId) return "No Batch";
    const batch = displayBatches.find(b => b.id === batchId);
    return batch ? batch.name : "Unknown Batch";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800">Students ({displayStudents.length})</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Parent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {displayStudents.map((student) => (
              <tr key={student.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{student.name}</div>
                    <div className="text-sm text-neutral-500">
                      Joined {student.joinDate?.toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-neutral-900">
                      <Phone className="w-3 h-3 mr-1" />
                      {student.phone}
                    </div>
                    {student.email && (
                      <div className="flex items-center text-sm text-neutral-500">
                        <Mail className="w-3 h-3 mr-1" />
                        {student.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{student.parentName}</div>
                    <div className="text-sm text-neutral-500">{student.parentPhone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary">{getBatchName(student.batchId)}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={student.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {student.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
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