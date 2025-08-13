import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Shield, Globe, HardDrive } from "lucide-react";

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "365",
    timezone: "Asia/Kolkata",
    language: "en",
    enableLogging: true,
    maxFileSize: "10",
    sessionTimeout: "60"
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">System Settings</h3>
        <p className="text-sm text-neutral-600">
          Configure system-wide settings, backups, and security options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-base">Data Management</CardTitle>
            </div>
            <CardDescription>
              Configure data backup and retention policies.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Automatic Backups</Label>
                <p className="text-sm text-neutral-600">Regular data backups</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
              />
            </div>

            {settings.autoBackup && (
              <>
                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select 
                    value={settings.backupFrequency} 
                    onValueChange={(value) => updateSetting('backupFrequency', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => updateSetting('dataRetention', e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-neutral-600 mt-1">
                    How long to keep backup data
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-green-600" />
              <CardTitle className="text-base">Localization</CardTitle>
            </div>
            <CardDescription>
              Configure regional and language settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => updateSetting('timezone', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => updateSetting('language', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                  <SelectItem value="gu">Gujarati</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-600" />
              <CardTitle className="text-base">Security</CardTitle>
            </div>
            <CardDescription>
              Configure security and access settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Activity Logging</Label>
                <p className="text-sm text-neutral-600">Log user activities</p>
              </div>
              <Switch
                checked={settings.enableLogging}
                onCheckedChange={(checked) => updateSetting('enableLogging', checked)}
              />
            </div>

            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-neutral-600 mt-1">
                Auto-logout after inactivity
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-base">File Management</CardTitle>
            </div>
            <CardDescription>
              Configure file upload and storage settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => updateSetting('maxFileSize', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-neutral-600 mt-1">
                Maximum size for document uploads
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-2">Important Notes</h4>
        <ul className="text-sm text-red-800 space-y-1">
          <li>• Changes to backup settings take effect immediately</li>
          <li>• Timezone changes affect all timestamps and scheduling</li>
          <li>• Reducing session timeout logs out active users</li>
          <li>• Contact support before modifying critical system settings</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button>Save System Settings</Button>
      </div>
    </div>
  );
}