import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, MessageSquare, Clock } from "lucide-react";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    attendanceReminders: true,
    feeReminders: true,
    examNotifications: true,
    parentNotifications: true,
    emailEnabled: true,
    smsEnabled: false,
    reminderTime: "09:00",
    feeReminderDays: "7"
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">Notification Settings</h3>
        <p className="text-sm text-neutral-600">
          Configure automated notifications for students, parents, and staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-base">Notification Types</CardTitle>
            </div>
            <CardDescription>
              Choose which types of notifications to send automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Attendance Reminders</Label>
                <p className="text-sm text-neutral-600">Daily attendance notifications</p>
              </div>
              <Switch
                checked={settings.attendanceReminders}
                onCheckedChange={(checked) => updateSetting('attendanceReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Fee Reminders</Label>
                <p className="text-sm text-neutral-600">Overdue fee notifications</p>
              </div>
              <Switch
                checked={settings.feeReminders}
                onCheckedChange={(checked) => updateSetting('feeReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Exam Notifications</Label>
                <p className="text-sm text-neutral-600">Mock exam schedules and results</p>
              </div>
              <Switch
                checked={settings.examNotifications}
                onCheckedChange={(checked) => updateSetting('examNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Parent Notifications</Label>
                <p className="text-sm text-neutral-600">Send copies to parents</p>
              </div>
              <Switch
                checked={settings.parentNotifications}
                onCheckedChange={(checked) => updateSetting('parentNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <CardTitle className="text-base">Delivery Methods</CardTitle>
            </div>
            <CardDescription>
              Configure how notifications are delivered.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <div>
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-neutral-600">Send via email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => updateSetting('emailEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <div>
                  <Label className="font-medium">SMS Notifications</Label>
                  <p className="text-sm text-neutral-600">Send via SMS</p>
                </div>
              </div>
              <Switch
                checked={settings.smsEnabled}
                onCheckedChange={(checked) => updateSetting('smsEnabled', checked)}
              />
            </div>

            {!settings.smsEnabled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  SMS notifications require Twilio integration to be configured.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-base">Timing Settings</CardTitle>
          </div>
          <CardDescription>
            Configure when and how often notifications are sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reminderTime">Daily Reminder Time</Label>
              <Input
                id="reminderTime"
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSetting('reminderTime', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-neutral-600 mt-1">
                Time to send daily attendance reminders
              </p>
            </div>

            <div>
              <Label htmlFor="feeReminderDays">Fee Reminder Days</Label>
              <Select 
                value={settings.feeReminderDays} 
                onValueChange={(value) => updateSetting('feeReminderDays', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="7">7 days before</SelectItem>
                  <SelectItem value="14">14 days before</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-600 mt-1">
                When to send fee due reminders
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Notification Settings</Button>
      </div>
    </div>
  );
}