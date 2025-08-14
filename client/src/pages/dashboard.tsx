import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminSidebar } from "@/components/admin-sidebar";
import { MessageComposer } from "@/components/message-composer";
import { MessageInbox } from "@/components/message-inbox";
import { MessageSent } from "@/components/message-sent";
import StatsCards from "@/components/dashboard/stats-cards";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";
import IntegrationStatus from "@/components/dashboard/integration-status";
import AttendanceChart from "@/components/dashboard/attendance-chart";
import FeeOverview from "@/components/dashboard/fee-overview";
import AchievementsPanel from "@/components/dashboard/achievements-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: true,
  });

  const handleSectionChange = (section: string) => {
    setActiveTab(section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-gray-900">
      <AdminSidebar activeSection={activeTab} onSectionChange={handleSectionChange} />
      
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-neutral-200 dark:border-gray-700 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-gray-200">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "messages" && "Messages"}
                {activeTab === "batches" && "Batch Management"}
                {activeTab === "users" && "User Management"}
              </h2>
              <p className="text-neutral-600 dark:text-gray-400 mt-1">
                {activeTab === "dashboard" && "Welcome back! Here's what's happening at EduConnect today."}
                {activeTab === "messages" && "Manage communications and send notifications to users."}
                {activeTab === "batches" && "Create and manage student batches and classes."}
                {activeTab === "users" && "Manage user accounts and permissions."}
              </p>
            </div>
            <div className="text-sm text-neutral-500 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {activeTab === "dashboard" && (
            <div>
              <StatsCards stats={stats as any} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-1">
                  <QuickActions />
                </div>
                <div className="lg:col-span-2">
                  <IntegrationStatus />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <AttendanceChart />
                <FeeOverview />
              </div>
              
              <RecentActivity />
              
              <div className="mt-8">
                <AchievementsPanel />
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="max-w-6xl">
              <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="inbox">Inbox</TabsTrigger>
                  <TabsTrigger value="sent">Sent</TabsTrigger>
                  <TabsTrigger value="compose">Compose</TabsTrigger>
                </TabsList>
                <TabsContent value="inbox" className="mt-6">
                  <MessageInbox />
                </TabsContent>
                <TabsContent value="sent" className="mt-6">
                  <MessageSent />
                </TabsContent>
                <TabsContent value="compose" className="mt-6">
                  <MessageComposer />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "batches" && (
            <div className="max-w-4xl">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-gray-200 mb-4">Batch Management</h3>
                <p className="text-neutral-600 dark:text-gray-400">Batch management features will be implemented here.</p>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="max-w-4xl">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-gray-200 mb-4">User Management</h3>
                <p className="text-neutral-600 dark:text-gray-400">User management features will be implemented here.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}