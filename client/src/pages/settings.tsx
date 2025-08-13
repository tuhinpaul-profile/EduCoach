import Sidebar from "@/components/shared/sidebar";
import IntegrationsPanel from "@/components/settings/integrations-panel";
import NotificationSettings from "@/components/settings/notification-settings";
import SystemSettings from "@/components/settings/system-settings";
import UserManagement from "@/components/settings/user-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-neutral-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Settings & Integrations</h2>
              <p className="text-neutral-600 mt-1">Manage system settings, integrations, and user preferences</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          <Tabs defaultValue="integrations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="integrations">
              <IntegrationsPanel />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="system">
              <SystemSettings />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}