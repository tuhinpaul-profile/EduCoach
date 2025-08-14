import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Inbox, 
  Mail, 
  MailOpen,
  Search,
  Calendar,
  User,
  CheckCheck,
  Trash2,
  Eye,
  Reply
} from "lucide-react";
import { formatDistance } from "date-fns";

interface Message {
  id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  fromUserId: string;
  fromUser?: {
    name: string;
    role: string;
  };
}

export function MessageInbox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterType, setFilterType] = useState<"all" | "unread" | "read">("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inbox messages
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/notifications/inbox"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications/inbox");
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const res = await apiRequest("POST", `/api/notifications/${messageId}/mark-read`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const res = await apiRequest("DELETE", `/api/notifications/${messageId}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        description: "The message has been removed from your inbox.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      setSelectedMessage(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete message",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/notifications/mark-all-read");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "All messages marked as read",
        description: "Your inbox has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  // Filter and search messages
  const filteredMessages = messages
    .filter(message => {
      if (filterType === "unread" && message.isRead) return false;
      if (filterType === "read" && !message.isRead) return false;
      if (searchTerm && !message.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !message.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              <CardTitle>Inbox</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
          <CardDescription>
            Manage your incoming messages and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("unread")}
              >
                Unread
              </Button>
              <Button
                variant={filterType === "read" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("read")}
              >
                Read
              </Button>
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-2">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages found</p>
                <p className="text-sm">
                  {filterType !== "all" 
                    ? `No ${filterType} messages to display`
                    : "Your inbox is empty"
                  }
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    message.isRead ? "bg-background" : "bg-muted/30 border-primary/20"
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {message.isRead ? (
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Mail className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium truncate ${message.isRead ? "" : "font-semibold"}`}>
                              {message.title}
                            </h4>
                            {!message.isRead && (
                              <Badge variant="default" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{message.fromUser?.name || "System"}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {message.fromUser?.role || "Admin"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDistance(new Date(message.createdAt), new Date(), { addSuffix: true })}</span>
                            </div>
                          </div>
                          <p className={`text-sm text-muted-foreground line-clamp-2 ${message.isRead ? "" : "font-medium"}`}>
                            {message.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageClick(message);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message.id);
                          }}
                          disabled={deleteMessageMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {selectedMessage?.title}
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>From: {selectedMessage?.fromUser?.name || "System"}</span>
                  <Badge variant="outline" className="text-xs capitalize ml-1">
                    {selectedMessage?.fromUser?.role || "Admin"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {selectedMessage?.createdAt && 
                      formatDistance(new Date(selectedMessage.createdAt), new Date(), { addSuffix: true })
                    }
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ 
                __html: selectedMessage?.content || "" 
              }}
            />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}