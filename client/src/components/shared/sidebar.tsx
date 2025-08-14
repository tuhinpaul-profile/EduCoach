import { Link, useLocation } from "wouter";
import { 
  GraduationCap, 
  LayoutDashboard, 
  HelpCircle, 
  FileText, 
  Users, 
  CheckCircle, 
  DollarSign, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-neutral-200 dark:border-gray-700 fixed h-full z-10">
      <div className="p-6 border-b border-neutral-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 200 200" className="text-white">
              <g transform="translate(100, 100)">
                <rect x="-20" y="-12" width="40" height="24" rx="2" fill="currentColor" />
                <rect x="-18" y="-10" width="36" height="20" rx="1" fill="white" />
                <line x1="-12" y1="-6" x2="12" y2="-6" stroke="currentColor" strokeWidth="1.5" />
                <line x1="-12" y1="-2" x2="12" y2="-2" stroke="currentColor" strokeWidth="1.5" />
                <line x1="-12" y1="2" x2="8" y2="2" stroke="currentColor" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">EduConnect</h1>
            <p className="text-sm text-neutral-500 dark:text-gray-400">Learning Platform</p>
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
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                  : "text-neutral-600 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700"
              }`}>
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* Bottom section with user info and logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-700 dark:text-gray-300 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-gray-400 capitalize">
                {user?.role || 'Member'}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}