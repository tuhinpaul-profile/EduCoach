import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Mail,
  Search,
  Calendar,
  Users,
  Eye,
  Target,
  CheckCircle,
  Clock
} from "lucide-react";
import { formatDistance } from "date-fns";

interface SentMessage {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  recipientCount?: number;
  readCount?: number;
  recipients?: Array<{
    id: string;
    name: string;
    role: string;
    isRead: boolean;
    readAt: string | null;
  }>;
}

export function MessageSent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<SentMessage | null>(null);
  const [filterType, setFilterType] = useState<"all" | "broadcast" | "individual">("all");

  // Fetch sent messages
  const { data: messages = [], isLoading } = useQuery<SentMessage[]>({
    queryKey: ["/api/notifications/sent"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/notifications/sent");
      return res.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Filter and search messages
  const filteredMessages = messages
    .filter(message => {
      if (filterType === "broadcast" && message.type !== "broadcast") return false;
      if (filterType === "individual" && message.type === "broadcast") return false;
      if (searchTerm && !message.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !message.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleMessageClick = async (message: SentMessage) => {
    // Fetch detailed message info including recipients
    const res = await apiRequest("GET", `/api/notifications/${message.id}/details`);
    const detailedMessage = await res.json();
    setSelectedMessage(detailedMessage);
  };

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
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            <CardTitle>Sent Messages</CardTitle>
            <Badge variant="outline" className="ml-2">
              {messages.length} sent
            </Badge>
          </div>
          <CardDescription>
            View and track your sent messages and broadcast status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sent messages..."
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
                variant={filterType === "broadcast" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("broadcast")}
              >
                Broadcasts
              </Button>
              <Button
                variant={filterType === "individual" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("individual")}
              >
                Individual
              </Button>
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-2">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sent messages found</p>
                <p className="text-sm">
                  {filterType !== "all" 
                    ? `No ${filterType} messages to display`
                    : "You haven't sent any messages yet"
                  }
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleMessageClick(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {message.type === "broadcast" ? (
                            <Target className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Mail className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{message.title}</h4>
                            <Badge 
                              variant={message.type === "broadcast" ? "default" : "secondary"}
                              className="text-xs capitalize"
                            >
                              {message.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{message.recipientCount || 0} recipients</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{message.readCount || 0} read</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDistance(new Date(message.createdAt), new Date(), { addSuffix: true })}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {message.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                          
                          {/* Delivery Status */}
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 bg-muted/30 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ 
                                  width: `${message.recipientCount ? (message.readCount || 0) / message.recipientCount * 100 : 0}%` 
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {message.recipientCount ? 
                                `${Math.round((message.readCount || 0) / message.recipientCount * 100)}%` : 
                                "0%"
                              } read
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
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

      {/* Message Details Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              {selectedMessage?.title}
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-4 mt-2">
                <Badge 
                  variant={selectedMessage?.type === "broadcast" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {selectedMessage?.type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Sent {selectedMessage?.createdAt && 
                      formatDistance(new Date(selectedMessage.createdAt), new Date(), { addSuffix: true })
                    }
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Message Content */}
            <div className="space-y-2">
              <h4 className="font-medium">Message Content</h4>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert bg-muted/20 p-4 rounded-lg"
                dangerouslySetInnerHTML={{ 
                  __html: selectedMessage?.content || "" 
                }}
              />
            </div>

            {/* Delivery Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{selectedMessage?.recipientCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Recipients</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold text-green-600">{selectedMessage?.readCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Messages Read</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold text-orange-600">
                    {(selectedMessage?.recipientCount || 0) - (selectedMessage?.readCount || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </CardContent>
              </Card>
            </div>

            {/* Recipients List */}
            {selectedMessage?.recipients && selectedMessage.recipients.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Recipients ({selectedMessage.recipients.length})</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {selectedMessage.recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          recipient.isRead ? "bg-green-500" : "bg-orange-500"
                        }`} />
                        <div>
                          <div className="font-medium">{recipient.name}</div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {recipient.role}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {recipient.isRead ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Read {recipient.readAt && formatDistance(new Date(recipient.readAt), new Date(), { addSuffix: true })}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Clock className="h-3 w-3" />
                            Unread
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}