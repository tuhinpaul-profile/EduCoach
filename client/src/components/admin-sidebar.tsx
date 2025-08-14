import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  LayoutDashboard,
  MessageSquare, 
  Send, 
  Inbox, 
  Edit3,
  Users, 
  Calendar,
  IndianRupee,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Bell
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  activeSubSection?: string;
  onSectionChange: (section: string, subSection?: string) => void;
  unreadCount?: number;
  onLogout: () => void;
  userName: string;
  userRole: string;
}

export function AdminSidebar({ 
  activeSection, 
  activeSubSection, 
  onSectionChange, 
  unreadCount = 0, 
  onLogout,
  userName,
  userRole
}: SidebarProps) {
  const [isMessagesExpanded, setIsMessagesExpanded] = useState(
    activeSection === "messages" || activeSection === "inbox" || activeSection === "sent" || activeSection === "compose"
  );

  const mainSections = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
      expandable: true,
      expanded: isMessagesExpanded,
      subSections: [
        { id: "inbox", label: "Inbox", icon: Inbox, badge: unreadCount > 0 ? unreadCount : undefined },
        { id: "sent", label: "Sent", icon: Send },
        { id: "compose", label: "Compose", icon: Edit3 },
      ]
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
    },
    {
      id: "batches",
      label: "Batches",
      icon: Calendar,
    },
    {
      id: "question-bank",
      label: "Question Bank",
      icon: BookOpen,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleSectionClick = (sectionId: string, subSectionId?: string) => {
    if (sectionId === "messages") {
      setIsMessagesExpanded(!isMessagesExpanded);
      if (!subSectionId && isMessagesExpanded) {
        onSectionChange("inbox");
      } else if (!subSectionId) {
        onSectionChange("inbox");
      }
    } else {
      onSectionChange(sectionId, subSectionId);
    }
  };

  const isActiveSection = (sectionId: string, subSectionId?: string) => {
    if (subSectionId) {
      return activeSection === subSectionId || (activeSection === sectionId && activeSubSection === subSectionId);
    }
    return activeSection === sectionId;
  };

  return (
    <div className="w-64 bg-background border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EC</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">EduConnect</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="font-medium text-sm text-foreground truncate">{userName}</p>
          <div className="flex items-center justify-between mt-1">
            <Badge variant="outline" className="text-xs capitalize">
              {userRole}
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {mainSections.map((section) => (
          <div key={section.id}>
            <Button
              variant={isActiveSection(section.id) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-10 px-3",
                isActiveSection(section.id) && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleSectionClick(section.id)}
            >
              <section.icon className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">{section.label}</span>
              
              {section.badge && (
                <Badge 
                  variant={isActiveSection(section.id) ? "secondary" : "default"} 
                  className="ml-2 h-5 min-w-5 text-xs px-1.5"
                >
                  {section.badge}
                </Badge>
              )}
              
              {section.expandable && (
                section.expanded ? 
                <ChevronDown className="ml-2 h-4 w-4" /> : 
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>

            {/* Sub-sections */}
            {section.subSections && section.expanded && (
              <div className="mt-1 ml-4 space-y-1">
                {section.subSections.map((subSection) => (
                  <Button
                    key={subSection.id}
                    variant={isActiveSection(section.id, subSection.id) ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start h-8 px-3",
                      isActiveSection(section.id, subSection.id) && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => onSectionChange(subSection.id)}
                  >
                    <subSection.icon className="mr-2 h-3 w-3" />
                    <span className="flex-1 text-left text-sm">{subSection.label}</span>
                    {subSection.badge && (
                      <Badge 
                        variant={isActiveSection(section.id, subSection.id) ? "secondary" : "default"}
                        className="ml-2 h-4 min-w-4 text-xs px-1"
                      >
                        {subSection.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}