import { HelpCircle, Book, FileText, CloudUpload } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    totalQuestions: number;
    totalSubjects: number;
    totalMockExams: number;
    recentUploads: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const defaultStats = {
    totalQuestions: 0,
    totalSubjects: 4,
    totalMockExams: 0,
    recentUploads: 0,
  };

  const data = stats || defaultStats;

  const cards = [
    {
      title: "Total Questions",
      value: data.totalQuestions.toLocaleString(),
      icon: HelpCircle,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: "+12%",
      trendText: "from last month",
    },
    {
      title: "Subjects",
      value: data.totalSubjects.toString(),
      icon: Book,
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary",
      subtitle: "Physics, Chemistry, Maths, Biology",
    },
    {
      title: "Mock Exams",
      value: data.totalMockExams.toLocaleString(),
      icon: FileText,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      trend: "+8",
      trendText: "this week",
    },
    {
      title: "Recent Uploads",
      value: data.recentUploads.toString(),
      icon: CloudUpload,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      subtitle: "Last 7 days",
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
                <p className="text-2xl font-bold text-neutral-800">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className={`${card.iconColor} text-xl`} />
              </div>
            </div>
            
            <div className="mt-4">
              {card.trend ? (
                <div className="flex items-center space-x-2">
                  <span className="text-secondary text-sm font-medium">↗ {card.trend}</span>
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
