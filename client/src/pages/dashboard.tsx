import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/shared/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";
import IntegrationStatus from "@/components/dashboard/integration-status";
import AttendanceChart from "@/components/dashboard/attendance-chart";
import FeeOverview from "@/components/dashboard/fee-overview";
import AchievementsPanel from "@/components/dashboard/achievements-panel";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: true,
  });

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
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-neutral-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Dashboard</h2>
              <p className="text-neutral-600 mt-1">Welcome back! Here's what's happening at EduConnect today.</p>
            </div>
            <div className="text-sm text-neutral-500">
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
          <StatsCards stats={stats} />
          
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
        </main>
      </div>
    </div>
  );
}