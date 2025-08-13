import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/shared/sidebar";
import FeeFilters from "@/components/fees/fee-filters";
import FeesTable from "@/components/fees/fees-table";
import PaymentModal from "@/components/fees/payment-modal";
import { Button } from "@/components/ui/button";
import { FeeFilter } from "@shared/schema";
import { CreditCard, AlertTriangle, Download } from "lucide-react";

export default function Fees() {
  const [filters, setFilters] = useState<FeeFilter>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<string | null>(null);

  const { data: fees = [], isLoading } = useQuery({
    queryKey: ["/api/fees", filters],
    enabled: true,
  });

  const { data: batches = [] } = useQuery({
    queryKey: ["/api/batches"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/fees/stats"],
  });

  const feeStats = {
    totalPending: 125000,
    overdue: 25000,
    thisMonth: 340000,
    overdueCount: 15
  };

  const handleRecordPayment = (feeId: string) => {
    setSelectedFee(feeId);
    setIsPaymentModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading fees...</p>
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
              <h2 className="text-2xl font-bold text-neutral-800">Fee Management</h2>
              <p className="text-neutral-600 mt-1">Track payments, manage due dates, and send reminders</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">₹{(feeStats.thisMonth / 1000).toFixed(0)}k Collected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 font-medium">₹{(feeStats.overdue / 1000).toFixed(0)}k Overdue</span>
                </div>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <p className="text-sm text-neutral-600">Total Pending</p>
              <p className="text-xl font-bold text-neutral-800">₹{(feeStats.totalPending / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <p className="text-sm text-neutral-600">Overdue Amount</p>
              <p className="text-xl font-bold text-red-600">₹{(feeStats.overdue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <p className="text-sm text-neutral-600">This Month</p>
              <p className="text-xl font-bold text-green-600">₹{(feeStats.thisMonth / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <p className="text-sm text-neutral-600">Overdue Students</p>
              <p className="text-xl font-bold text-orange-600">{feeStats.overdueCount}</p>
            </div>
          </div>

          <FeeFilters 
            filters={filters} 
            onFilterChange={setFilters}
            batches={batches}
          />
          
          <FeesTable 
            fees={fees}
            onRecordPayment={handleRecordPayment}
            batches={batches}
          />
        </main>
      </div>
      
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedFee(null);
        }}
        feeId={selectedFee}
      />
    </div>
  );
}