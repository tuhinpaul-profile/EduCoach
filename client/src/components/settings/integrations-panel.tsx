import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, ExternalLink, Settings } from "lucide-react";

export default function IntegrationsPanel() {
  const [integrations, setIntegrations] = useState([
    {
      id: "google-forms",
      name: "Google Forms",
      description: "Enable mobile attendance marking through Google Forms",
      enabled: true,
      status: "connected",
      icon: "📋",
      config: {
        formId: "1FAIpQLSe...",
        webhookUrl: "https://api.zerokelvin.com/webhooks/attendance"
      }
    },
    {
      id: "google-sheets",
      name: "Google Sheets",
      description: "Automatic data backup and sync with Google Sheets",
      enabled: true,
      status: "connected", 
      icon: "📊",
      config: {
        spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        sheetName: "ZeroKelvin_Data"
      }
    },
    {
      id: "twilio",
      name: "Twilio SMS",
      description: "Send SMS notifications to students and parents",
      enabled: false,
      status: "disconnected",
      icon: "💬",
      config: {
        accountSid: "",
        authToken: "",
        fromNumber: ""
      }
    },
    {
      id: "sendgrid",
      name: "SendGrid Email",
      description: "Automated email reminders and notifications",
      enabled: true,
      status: "connected",
      icon: "📧",
      config: {
        apiKey: "SG.xxx",
        fromEmail: "noreply@zerokelvin.com"
      }
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Create custom automation workflows",
      enabled: false,
      status: "pending",
      icon: "⚡",
      config: {
        webhookUrl: ""
      }
    },
    {
      id: "make",
      name: "Make.com",
      description: "Advanced visual automation platform",
      enabled: false,
      status: "disconnected",
      icon: "🔧",
      config: {}
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "disconnected": return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
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

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">External Integrations</h3>
        <p className="text-sm text-neutral-600">
          Connect with external services to automate workflows and enhance functionality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {integration.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => toggleIntegration(integration.id)}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                  </Badge>
                  {integration.status === "connected" && (
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open
                    </Button>
                  )}
                </div>

                {integration.enabled && (
                  <div className="space-y-3">
                    {integration.id === "google-forms" && integration.config.formId && (
                      <div>
                        <Label className="text-xs">Form ID</Label>
                        <Input 
                          value={integration.config.formId} 
                          readOnly 
                          className="text-xs"
                        />
                      </div>
                    )}
                    
                    {integration.id === "google-sheets" && integration.config.spreadsheetId && (
                      <div>
                        <Label className="text-xs">Spreadsheet ID</Label>
                        <Input 
                          value={integration.config.spreadsheetId} 
                          readOnly 
                          className="text-xs"
                        />
                      </div>
                    )}

                    {integration.id === "sendgrid" && integration.config.fromEmail && (
                      <div>
                        <Label className="text-xs">From Email</Label>
                        <Input 
                          value={integration.config.fromEmail} 
                          readOnly 
                          className="text-xs"
                        />
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Integration Benefits</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Google Forms:</strong> Quick mobile attendance marking by trainers</li>
          <li>• <strong>Google Sheets:</strong> Real-time data backup and sharing</li>
          <li>• <strong>SMS/Email:</strong> Automated reminders for absent students and fee dues</li>
          <li>• <strong>Zapier/Make.com:</strong> Custom workflows and advanced automations</li>
        </ul>
      </div>
    </div>
  );
}