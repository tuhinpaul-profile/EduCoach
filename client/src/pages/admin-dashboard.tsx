import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  MessageSquare, 
  Send, 
  Inbox, 
  Bell, 
  Settings, 
  Plus,
  Calendar,
  Clock,
  IndianRupee,
  BookOpen,
  LogOut
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

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  fromUserId: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  phone: string;
}

interface Batch {
  id: string;
  name: string;
  subject: string;
  timings: string;
  fees: number;
  maxStudents: number;
  currentStudents: number;
  startDate: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messageModal, setMessageModal] = useState(false);
  const [batchModal, setBatchModal] = useState(false);

  // Dashboard stats query
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/dashboard/stats");
      return res.json();
    },
  });

  // Notifications queries
  const { data: inbox = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications/inbox"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications/inbox");
      return res.json();
    },
  });

  const { data: sent = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications/sent"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications/sent");
      return res.json();
    },
  });

  const { data: unreadCount = 0 } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications/unread-count");
      return res.json();
    },
  }).data?.count || 0;

  // Users query for message recipients
  const { data: teachers = [] } = useQuery<User[]>({
    queryKey: ["/api/auth/users/teacher"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/auth/users/teacher");
      return res.json();
    },
  });

  const { data: students = [] } = useQuery<User[]>({
    queryKey: ["/api/auth/users/student"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/auth/users/student");
      return res.json();
    },
  });

  // Batches query
  const { data: batches = [] } = useQuery<Batch[]>({
    queryKey: ["/api/batches"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/batches");
      return res.json();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="batches" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Batches
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.todayAttendance || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.attendancePercentage || 0}% attendance rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats?.pendingFees?.toLocaleString() || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeBatches || 0}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New student enrollment</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Fee payment received</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Attendance marked</p>
                      <p className="text-xs text-gray-500">30 minutes ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => setMessageModal(true)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                  <Button className="w-full justify-start" onClick={() => setBatchModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Batch
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Students
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Notifications & Messages</h2>
              <Button onClick={() => setMessageModal(true)}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>

            <Tabs defaultValue="inbox" className="space-y-4">
              <TabsList>
                <TabsTrigger value="inbox" className="flex items-center gap-2">
                  <Inbox className="w-4 h-4" />
                  Inbox ({inbox.length})
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Sent ({sent.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inbox" className="space-y-4">
                {inbox.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      No messages in inbox
                    </CardContent>
                  </Card>
                ) : (
                  inbox.map((message) => (
                    <Card key={message.id} className={!message.isRead ? "border-blue-500" : ""}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{message.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            {!message.isRead && <Badge variant="destructive">New</Badge>}
                            <Badge variant="outline">{message.type}</Badge>
                          </div>
                        </div>
                        <CardDescription>
                          {new Date(message.createdAt).toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{message.content}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="sent" className="space-y-4">
                {sent.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      No sent messages
                    </CardContent>
                  </Card>
                ) : (
                  sent.map((message) => (
                    <Card key={message.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{message.title}</CardTitle>
                          <Badge variant="outline">{message.type}</Badge>
                        </div>
                        <CardDescription>
                          {new Date(message.createdAt).toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{message.content}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Batches Tab */}
          <TabsContent value="batches" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Batch Management</h2>
              <Button onClick={() => setBatchModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Batch
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {batches.map((batch) => (
                <Card key={batch.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{batch.name}</CardTitle>
                      <Badge variant={batch.isActive ? "default" : "secondary"}>
                        {batch.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{batch.subject}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      {batch.timings}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee className="w-4 h-4" />
                      ₹{batch.fees}/month
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      {batch.currentStudents}/{batch.maxStudents} students
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <Tabs defaultValue="teachers" className="space-y-4">
              <TabsList>
                <TabsTrigger value="teachers">Teachers ({teachers.length})</TabsTrigger>
                <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="teachers" className="space-y-4">
                <div className="grid gap-4">
                  {teachers.map((teacher) => (
                    <Card key={teacher.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{teacher.name}</h3>
                            <p className="text-sm text-gray-500">{teacher.phone}</p>
                          </div>
                          <Badge variant="outline">{teacher.role}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <div className="grid gap-4">
                  {students.map((student) => (
                    <Card key={student.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm text-gray-500">{student.phone}</p>
                          </div>
                          <Badge variant="outline">{student.role}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Message Modal */}
      <Dialog open={messageModal} onOpenChange={setMessageModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message/Notification</DialogTitle>
            <DialogDescription>
              Send a message to specific users or broadcast to multiple recipients
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Message Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">Direct Message</SelectItem>
                  <SelectItem value="broadcast">Broadcast</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Recipients</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-teachers">All Teachers</SelectItem>
                  <SelectItem value="all-students">All Students</SelectItem>
                  <SelectItem value="all-parents">All Parents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Message title" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea placeholder="Message content" rows={4} />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setMessageModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Batch Modal */}
      <Dialog open={batchModal} onOpenChange={setBatchModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
            <DialogDescription>
              Add a new batch for students
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Batch Name</Label>
              <Input placeholder="e.g., Physics JEE Main 2025" />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timings</Label>
              <Input placeholder="e.g., Mon-Fri 10:00-12:00" />
            </div>
            <div className="space-y-2">
              <Label>Monthly Fees</Label>
              <Input type="number" placeholder="5000" />
            </div>
            <div className="space-y-2">
              <Label>Maximum Students</Label>
              <Input type="number" placeholder="30" />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setBatchModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Batch</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}