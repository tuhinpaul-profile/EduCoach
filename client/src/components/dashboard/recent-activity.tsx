import { Clock, User, DollarSign, FileText, CheckCircle } from "lucide-react";

interface Activity {
  id: string;
  type: "student" | "fee" | "attendance" | "exam" | "question";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export default function RecentActivity() {
  const activities: Activity[] = [
    {
      id: "1",
      type: "student",
      title: "New Student Registered",
      description: "Priya Sharma joined Physics Batch A",
      timestamp: "2 hours ago",
      user: "Admin"
    },
    {
      id: "2", 
      type: "fee",
      title: "Fee Payment Received",
      description: "Rahul Kumar paid ₹5,000 for Math Batch B",
      timestamp: "3 hours ago",
      user: "Accountant"
    },
    {
      id: "3",
      type: "attendance",
      title: "Attendance Marked",
      description: "Chemistry Batch C - 28/30 students present",
      timestamp: "4 hours ago",
      user: "Teacher"
    },
    {
      id: "4",
      type: "question",
      title: "Questions Uploaded",
      description: "45 new Physics questions added to question bank",
      timestamp: "5 hours ago",
      user: "Content Team"
    },
    {
      id: "5",
      type: "exam",
      title: "Mock Exam Created",
      description: "JEE Advanced Physics Mock Test #15",
      timestamp: "6 hours ago",
      user: "Faculty"
    },
    {
      id: "6",
      type: "fee",
      title: "Fee Reminder Sent", 
      description: "15 students notified about pending fees",
      timestamp: "1 day ago",
      user: "System"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "student": return <User className="w-4 h-4 text-blue-600" />;
      case "fee": return <DollarSign className="w-4 h-4 text-green-600" />;
      case "attendance": return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case "exam": return <FileText className="w-4 h-4 text-orange-600" />;
      case "question": return <FileText className="w-4 h-4 text-indigo-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case "student": return "bg-blue-50";
      case "fee": return "bg-green-50";
      case "attendance": return "bg-purple-50";
      case "exam": return "bg-orange-50";
      case "question": return "bg-indigo-50";
      default: return "bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Recent Activity</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className={`w-10 h-10 ${getActivityBg(activity.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-800 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-neutral-500 flex-shrink-0 ml-2">
                  {activity.timestamp}
                </p>
              </div>
              <p className="text-sm text-neutral-600 mt-1">{activity.description}</p>
              {activity.user && (
                <p className="text-xs text-neutral-500 mt-1">by {activity.user}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}