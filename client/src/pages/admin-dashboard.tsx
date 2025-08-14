import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/admin-sidebar";
import { MessageInbox } from "@/components/message-inbox";
import { MessageSent } from "@/components/message-sent";
import { MessageComposer } from "@/components/message-composer";
import { 
  Users, 
  Calendar as CalendarIcon,
  IndianRupee,
  BookOpen,
  TrendingUp,
  UserCheck,
  Clock,
  GraduationCap
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface DashboardStats {
  totalStudents: number;
  todayAttendance: number;
  pendingFees: number;
  activeBatches: number;
  attendancePercentage: number;
  feesCollected: number;
}

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  // Dashboard stats query
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/dashboard/stats");
      return res.json();
    },
  });

  // Unread count query for sidebar
  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ["/api/notifications/unread-count"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications/unread-count");
      const data = await res.json();
      return data.count || 0;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return null;
  }

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back, {user.name}. Here's what's happening at your educational center.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{stats?.totalStudents || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
                <p className="text-2xl font-bold text-foreground">{stats?.todayAttendance || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-muted-foreground">
                {stats?.attendancePercentage || 0}% attendance rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Fees</p>
                <p className="text-2xl font-bold text-foreground">₹{stats?.pendingFees || 0}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Clock className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-orange-600">Requires attention</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Batches</p>
                <p className="text-2xl font-bold text-foreground">{stats?.activeBatches || 0}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-muted-foreground">
                Across all subjects
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setActiveSection("compose")}
              className="flex flex-col items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <CalendarIcon className="h-6 w-6 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Send Message</span>
            </button>
            <button 
              onClick={() => setActiveSection("users")}
              className="flex flex-col items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <Users className="h-6 w-6 text-green-500 mb-2" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Manage Users</span>
            </button>
            <button 
              onClick={() => setActiveSection("batches")}
              className="flex flex-col items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <GraduationCap className="h-6 w-6 text-purple-500 mb-2" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">View Batches</span>
            </button>
            <button 
              onClick={() => setActiveSection("question-bank")}
              className="flex flex-col items-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <BookOpen className="h-6 w-6 text-orange-500 mb-2" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Question Bank</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render different sections based on activeSection
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "inbox":
        return <MessageInbox />;
      case "sent":
        return <MessageSent />;
      case "compose":
        return <MessageComposer onMessageSent={() => setActiveSection("sent")} />;
      case "users":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage teachers, students, and coordinators</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">User management interface coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "batches":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch Management</CardTitle>
                <CardDescription>Create and manage teaching batches</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">Batch management interface coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "question-bank":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Question Bank</CardTitle>
                <CardDescription>Manage questions and assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">Question bank interface coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure system preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">Settings interface coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        unreadCount={unreadCount}
        onLogout={handleLogout}
        userName={user.name}
        userRole={user.role}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}