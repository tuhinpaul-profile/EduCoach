import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, X } from "lucide-react";
import { subjects, difficulties } from "@shared/schema";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [defaultDifficulty, setDefaultDifficulty] = useState("Medium");
  const [autoDetect, setAutoDetect] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/questions/upload", formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions/subject-tree"] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setFile(null);
    setSubject("");
    setChapter("");
    setDefaultDifficulty("Medium");
    setAutoDetect(true);
    onClose();
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        selectedFile.type !== "application/msword") {
      toast({
        title: "Invalid File Type",
        description: "Please select a Word document (.doc or .docx)",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleSubmit = () => {
    if (!file || !subject || !chapter) {
      toast({
        title: "Missing Information",
        description: "Please select a file and fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("subject", subject);
    formData.append("chapter", chapter);
    formData.append("defaultDifficulty", defaultDifficulty);
    formData.append("autoDetect", autoDetect.toString());

    uploadMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Question Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragOver 
                ? "border-primary bg-primary/5" 
                : file 
                  ? "border-green-300 bg-green-50" 
                  : "border-neutral-300 hover:border-primary"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CloudUpload className="text-primary text-2xl" />
            </div>
            {file ? (
              <div>
                <h4 className="text-lg font-medium text-green-800 mb-2">{file.name}</h4>
                <p className="text-green-600 mb-4">Ready to upload</p>
                <Button variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}>
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-medium text-neutral-800 mb-2">
                  Drag and drop your document here
                </h4>
                <p className="text-neutral-600 mb-4">or click to browse files</p>
                <p className="text-sm text-neutral-500">Supports .docx, .doc files up to 10MB</p>
              </div>
            )}
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".doc,.docx"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  handleFileSelect(selectedFile);
                }
              }}
            />
          </div>
          
          {/* Upload Settings */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chapter">Chapter *</Label>
                <Input
                  id="chapter"
                  placeholder="e.g., Mechanics"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Default Difficulty</Label>
                <Select value={defaultDifficulty} onValueChange={setDefaultDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="autoDetect"
                checked={autoDetect}
                onCheckedChange={(checked) => setAutoDetect(!!checked)}
              />
              <Label htmlFor="autoDetect" className="text-sm">
                Auto-detect question types and difficulty levels
              </Label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Processing..." : "Upload & Process"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
