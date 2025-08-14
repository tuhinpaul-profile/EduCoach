import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/rich-text-editor";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, Users, Target, Loader2, X } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: string;
  phone: string;
}

interface MessageComposerProps {
  onMessageSent?: () => void;
}

export function MessageComposer({ onMessageSent }: MessageComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "role" | "individual">("all");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users for recipient selection
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

  const { data: parents = [] } = useQuery<User[]>({
    queryKey: ["/api/auth/users/parent"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/auth/users/parent");
      return res.json();
    },
  });

  const allUsers = [...teachers, ...students, ...parents];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      title: string;
      content: string;
      recipientType: string;
      selectedRole?: string;
      selectedUsers?: string[];
    }) => {
      let requestBody;
      
      if (messageData.recipientType === "all") {
        // Send broadcast to all users
        const allUserIds = allUsers.map(user => user.id);
        requestBody = {
          title: messageData.title,
          content: messageData.content,
          type: "broadcast",
          recipients: allUserIds,
        };
      } else if (messageData.recipientType === "role" && messageData.selectedRole) {
        // Send broadcast to specific role
        const roleUserIds = allUsers
          .filter(user => user.role === messageData.selectedRole)
          .map(user => user.id);
        requestBody = {
          title: messageData.title,
          content: messageData.content,
          type: "broadcast",
          recipients: roleUserIds,
        };
      } else if (messageData.recipientType === "individual" && messageData.selectedUsers) {
        // Send broadcast to selected users
        requestBody = {
          title: messageData.title,
          content: messageData.content,
          type: "broadcast",
          recipients: messageData.selectedUsers,
        };
      } else {
        throw new Error("Invalid message configuration");
      }
      
      const res = await apiRequest("POST", "/api/notifications/send", {
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Your message has been delivered to the selected recipients.",
      });
      
      // Clear form
      setTitle("");
      setContent("");
      setRecipientType("all");
      setSelectedRole("");
      setSelectedUsers([]);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      
      onMessageSent?.();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (role: string) => {
    const roleUsers = allUsers.filter(user => user.role === role).map(user => user.id);
    const allSelected = roleUsers.every(id => selectedUsers.includes(id));
    
    if (allSelected) {
      setSelectedUsers(prev => prev.filter(id => !roleUsers.includes(id)));
    } else {
      setSelectedUsers(prev => Array.from(new Set([...prev, ...roleUsers])));
    }
  };

  const handleSendMessage = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Title and message content are required.",
        variant: "destructive",
      });
      return;
    }

    if (recipientType === "individual" && selectedUsers.length === 0) {
      toast({
        title: "Please select recipients",
        description: "You must select at least one recipient.",
        variant: "destructive",
      });
      return;
    }

    if (recipientType === "role" && !selectedRole) {
      toast({
        title: "Please select a role",
        description: "You must select a role for targeted messaging.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      title,
      content,
      recipientType,
      selectedRole,
      selectedUsers,
    });
  };

  const getRecipientCount = () => {
    switch (recipientType) {
      case "all":
        return allUsers.length;
      case "role":
        return selectedRole ? allUsers.filter(user => user.role === selectedRole).length : 0;
      case "individual":
        return selectedUsers.length;
      default:
        return 0;
    }
  };

  const selectedUsersList = selectedUsers
    .map(id => allUsers.find(user => user.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Compose Message
          </CardTitle>
          <CardDescription>
            Send messages to users across your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Message Title</Label>
            <Input
              id="title"
              placeholder="Enter message title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Recipient Selection */}
          <div className="space-y-4">
            <Label>Recipients</Label>
            
            <Select value={recipientType} onValueChange={(value: any) => setRecipientType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Users ({allUsers.length})
                  </div>
                </SelectItem>
                <SelectItem value="role">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    By Role
                  </div>
                </SelectItem>
                <SelectItem value="individual">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Individual Selection
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Role Selection */}
            {recipientType === "role" && (
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teachers ({teachers.length})</SelectItem>
                  <SelectItem value="student">Students ({students.length})</SelectItem>
                  <SelectItem value="parent">Parents ({parents.length})</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Individual User Selection */}
            {recipientType === "individual" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Select Recipients</span>
                  <Badge variant="outline">
                    {selectedUsers.length} selected
                  </Badge>
                </div>

                {/* Selected Users Display */}
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                    {selectedUsersList.map((user) => (
                      <Badge key={user?.id} variant="secondary" className="flex items-center gap-1">
                        {user?.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => handleUserToggle(user?.id || "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* User Selection by Role */}
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {["teacher", "student", "parent"].map((role) => {
                    const roleUsers = allUsers.filter(user => user.role === role);
                    if (roleUsers.length === 0) return null;

                    return (
                      <div key={role} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="capitalize font-medium">{role}s ({roleUsers.length})</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAll(role)}
                          >
                            {roleUsers.every(user => selectedUsers.includes(user.id)) ? "Deselect All" : "Select All"}
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {roleUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={user.id}
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => handleUserToggle(user.id)}
                              />
                              <Label
                                htmlFor={user.id}
                                className="text-sm font-normal cursor-pointer truncate"
                              >
                                {user.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recipient Summary */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>
                  Message will be sent to{" "}
                  <span className="font-medium">{getRecipientCount()}</span>{" "}
                  {getRecipientCount() === 1 ? "recipient" : "recipients"}
                </span>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <Label>Message Content</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Type your message here..."
            />
          </div>

          {/* Send Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || !title.trim() || !content.trim()}
              className="min-w-32"
            >
              {sendMessageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}