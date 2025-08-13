import { Link, useLocation } from "wouter";
import { 
  GraduationCap, 
  LayoutDashboard, 
  HelpCircle, 
  FileText, 
  Users, 
  CheckCircle, 
  DollarSign, 
  Settings 
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/question-bank", icon: HelpCircle, label: "Question Bank" },
    { href: "/mock-exams", icon: FileText, label: "Mock Exams" },
    { href: "/students", icon: Users, label: "Students" },
    { href: "/attendance", icon: CheckCircle, label: "Attendance" },
    { href: "/fees", icon: DollarSign, label: "Fee Management" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-neutral-200 fixed h-full z-10">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-800">ZeroKelvin</h1>
            <p className="text-sm text-neutral-500">Coaching Center</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}>
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}