import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeId: string | null;
}

export default function PaymentModal({ isOpen, onClose, feeId }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "",
    receiptNumber: "",
    notes: "",
    paidDate: new Date().toISOString().split('T')[0],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const recordPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/fees/${feeId}/payment`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Recorded",
        description: "Fee payment has been successfully recorded",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/fees"] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setFormData({
      amount: "",
      paymentMethod: "",
      receiptNumber: "",
      notes: "",
      paidDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and payment method",
        variant: "destructive",
      });
      return;
    }
    recordPaymentMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Fee Payment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount Paid *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="5000"
              required
            />
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Debit/Credit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paidDate">Payment Date</Label>
            <Input
              id="paidDate"
              type="date"
              value={formData.paidDate}
              onChange={(e) => setFormData({...formData, paidDate: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="receiptNumber">Receipt Number</Label>
            <Input
              id="receiptNumber"
              value={formData.receiptNumber}
              onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
              placeholder="RCP001"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional notes"
              rows={2}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={recordPaymentMutation.isPending}
            >
              {recordPaymentMutation.isPending ? "Recording..." : "Record Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}