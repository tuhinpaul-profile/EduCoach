import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  UserPlus, 
  CheckCircle, 
  Upload,
  FileText,
  CreditCard 
} from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Add Student",
      description: "Register a new student",
      icon: UserPlus,
      href: "/students",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Mark Attendance",
      description: "Record today's attendance",
      icon: CheckCircle,
      href: "/attendance",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Record Fee Payment",
      description: "Process fee payments",
      icon: CreditCard,
      href: "/fees",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Upload Questions",
      description: "Add questions to bank",
      icon: Upload,
      href: "/question-bank",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      title: "Create Mock Exam",
      description: "Generate new mock test",
      icon: FileText,
      href: "/mock-exams",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: "New Batch",
      description: "Start a new batch",
      icon: Plus,
      href: "/students",
      color: "bg-teal-600 hover:bg-teal-700",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-800 mb-6">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <Link key={index} href={action.href}>
              <Button 
                className={`w-full justify-start text-white ${action.color} p-4 h-auto`}
                variant="default"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}