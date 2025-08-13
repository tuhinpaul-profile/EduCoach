import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Settings,
  ExternalLink 
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "pending" | "error";
  lastSync?: string;
  icon: string;
}

export default function IntegrationStatus() {
  const integrations: Integration[] = [
    {
      id: "google-forms",
      name: "Google Forms",
      description: "Mobile attendance marking",
      status: "connected",
      lastSync: "2 hours ago",
      icon: "📋"
    },
    {
      id: "google-sheets", 
      name: "Google Sheets",
      description: "Data backup and sync",
      status: "connected", 
      lastSync: "1 hour ago",
      icon: "📊"
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automation workflows",
      status: "pending",
      icon: "⚡"
    },
    {
      id: "make",
      name: "Make.com",
      description: "Advanced automations",
      status: "disconnected", 
      icon: "🔧"
    },
    {
      id: "twilio",
      name: "Twilio SMS",
      description: "SMS notifications to parents",
      status: "error",
      lastSync: "Failed 3 hours ago",
      icon: "💬"
    },
    {
      id: "email",
      name: "Email Service",
      description: "Automated email reminders",
      status: "connected",
      lastSync: "30 minutes ago", 
      icon: "📧"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "disconnected": return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-100 text-green-800";
      case "error": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "disconnected": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const connectedCount = integrations.filter(i => i.status === "connected").length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">Integration Status</h3>
          <p className="text-sm text-neutral-600">{connectedCount}/{integrations.length} services connected</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Manage
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="p-4 border border-neutral-200 rounded-lg hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h4 className="font-medium text-neutral-800">{integration.name}</h4>
                  <p className="text-sm text-neutral-600">{integration.description}</p>
                </div>
              </div>
              {getStatusIcon(integration.status)}
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(integration.status)}>
                {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
              </Badge>
              
              {integration.lastSync && (
                <span className="text-xs text-neutral-500">
                  {integration.status === "error" ? integration.lastSync : `Synced ${integration.lastSync}`}
                </span>
              )}
            </div>
            
            {integration.status === "connected" && (
              <div className="mt-2">
                <Button variant="ghost" size="sm" className="text-xs p-1 h-auto">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}