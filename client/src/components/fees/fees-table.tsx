import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import { Fee, Batch } from "@shared/schema";

interface FeesTableProps {
  fees: Fee[];
  onRecordPayment: (feeId: string) => void;
  batches: Batch[];
}

export default function FeesTable({ fees, onRecordPayment, batches }: FeesTableProps) {
  const mockFees = [
    {
      id: "1",
      studentId: "1",
      batchId: "batch-1",
      amount: 5000,
      dueDate: new Date("2024-02-15"),
      paidDate: null,
      status: "overdue",
      paymentMethod: null,
      receiptNumber: null,
      notes: null,
      createdAt: new Date(),
      student: { name: "Priya Sharma", phone: "+91 9876543210" },
      batch: { name: "Physics Advanced" }
    },
    {
      id: "2",
      studentId: "2",
      batchId: "batch-1", 
      amount: 5000,
      dueDate: new Date("2024-02-20"),
      paidDate: new Date("2024-02-18"),
      status: "paid",
      paymentMethod: "upi",
      receiptNumber: "RCP001",
      notes: null,
      createdAt: new Date(),
      student: { name: "Rahul Kumar", phone: "+91 9876543213" },
      batch: { name: "Physics Advanced" }
    }
  ];

  const displayFees = fees.length > 0 ? fees : mockFees;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "overdue": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "pending": return <CreditCard className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800"; 
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return status !== "paid" && new Date() > new Date(dueDate);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800">
          Fee Records ({displayFees.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {displayFees.map((fee) => (
              <tr key={fee.id} className={`hover:bg-neutral-50 ${isOverdue(fee.dueDate, fee.status as string) ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {(fee as any).student?.name || "Student"}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {(fee as any).student?.phone || "No phone"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary">
                    {(fee as any).batch?.name || "No Batch"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-neutral-900">
                    ₹{fee.amount?.toLocaleString()}
                  </div>
                  {fee.receiptNumber && (
                    <div className="text-xs text-neutral-500">
                      Receipt: {fee.receiptNumber}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900">
                    {new Date(fee.dueDate).toLocaleDateString()}
                  </div>
                  {isOverdue(fee.dueDate, fee.status as string) && (
                    <div className="text-xs text-red-600 font-medium">
                      {Math.ceil((new Date().getTime() - new Date(fee.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(fee.status as string)}
                    <Badge className={getStatusColor(fee.status as string)}>
                      {(fee.status as string)?.charAt(0).toUpperCase() + (fee.status as string)?.slice(1)}
                    </Badge>
                  </div>
                  {fee.paidDate && (
                    <div className="text-xs text-neutral-500 mt-1">
                      Paid: {new Date(fee.paidDate).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {fee.status !== "paid" ? (
                    <Button 
                      size="sm"
                      onClick={() => onRecordPayment(fee.id)}
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Record Payment
                    </Button>
                  ) : (
                    <span className="text-green-600 text-sm">Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}