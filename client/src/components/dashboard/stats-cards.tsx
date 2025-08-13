import { Users, CheckCircle, DollarSign, GraduationCap } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    totalStudents: number;
    todayAttendance: number;
    pendingFees: number;
    activeBatches: number;
    attendancePercentage: number;
    feesCollected: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const defaultStats = {
    totalStudents: 245,
    todayAttendance: 210,
    pendingFees: 85000,
    activeBatches: 12,
    attendancePercentage: 85.7,
    feesCollected: 340000,
  };

  const data = stats || defaultStats;

  const cards = [
    {
      title: "Total Students",
      value: data.totalStudents.toLocaleString(),
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+12",
      trendText: "this month",
      trendPositive: true,
    },
    {
      title: "Today's Attendance",
      value: `${data.todayAttendance}/${data.totalStudents}`,
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      percentage: `${data.attendancePercentage}%`,
      trendPositive: data.attendancePercentage > 80,
    },
    {
      title: "Pending Fees",
      value: `₹${(data.pendingFees / 1000).toFixed(0)}k`,
      icon: DollarSign,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      trend: "-₹15k",
      trendText: "from last week",
      trendPositive: true,
    },
    {
      title: "Active Batches",
      value: data.activeBatches.toString(),
      icon: GraduationCap,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      subtitle: "Physics, Chemistry, Math, Biology",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium">{card.title}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-neutral-800">{card.value}</p>
                  {card.percentage && (
                    <span className={`text-sm font-medium ${
                      card.trendPositive ? "text-green-600" : "text-red-600"
                    }`}>
                      ({card.percentage})
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className={`${card.iconColor} text-xl`} />
              </div>
            </div>
            
            <div className="mt-4">
              {card.trend ? (
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    card.trendPositive ? "text-green-600" : "text-red-600"
                  }`}>
                    {card.trendPositive ? "↗" : "↘"} {card.trend}
                  </span>
                  <span className="text-neutral-500 text-sm">{card.trendText}</span>
                </div>
              ) : (
                <span className="text-neutral-500 text-sm">{card.subtitle}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}