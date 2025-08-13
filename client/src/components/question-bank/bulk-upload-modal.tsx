import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, X, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { subjects, difficulties } from "@shared/schema";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileStatus {
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  error?: string;
}

export default function BulkUploadModal({ isOpen, onClose }: BulkUploadModalProps) {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [defaultDifficulty, setDefaultDifficulty] = useState("Medium");
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkUploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/ai/bulk-upload", formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Bulk Upload Completed",
        description: data.message,
      });
      
      // Update file statuses based on results
      setFiles(prev => prev.map(fileStatus => {
        const result = data.results.find((r: any) => r.filename === fileStatus.file.name);
        return {
          ...fileStatus,
          status: result?.error ? 'error' : 'completed',
          result: result,
          error: result?.error
        };
      }));

      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions/subject-tree"] });
      setUploadProgress(100);
    },
    onError: (error) => {
      toast({
        title: "Bulk Upload Failed",
        description: error.message || "Failed to process bulk upload",
        variant: "destructive",
      });
      setFiles(prev => prev.map(f => ({ ...f, status: 'error', error: error.message })));
    },
  });

  const storeQuestionsMutation = useMutation({
    mutationFn: async (questions: any[]) => {
      const results = [];
      for (const question of questions) {
        const response = await apiRequest("POST", "/api/questions", question);
        const result = await response.json();
        results.push(result);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions/subject-tree"] });
    },
  });

  const handleClose = () => {
    setFiles([]);
    setSubject("");
    setChapter("");
    setDefaultDifficulty("Medium");
    setUploadProgress(0);
    onClose();
  };

  const handleFilesSelect = (selectedFiles: FileList) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
      "application/pdf"
    ];
    
    const validFiles: FileStatus[] = [];
    const invalidFiles: string[] = [];

    Array.from(selectedFiles).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(file.name);
      } else if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large)`);
      } else {
        validFiles.push({
          file,
          status: 'pending'
        });
      }
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Some files were rejected",
        description: `Invalid files: ${invalidFiles.join(", ")}`,
        variant: "destructive",
      });
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0 || !subject || !chapter) {
      toast({
        title: "Missing Information",
        description: "Please select files and fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    files.forEach(fileStatus => {
      formData.append("documents", fileStatus.file);
    });
    formData.append("subject", subject);
    formData.append("chapter", chapter);
    formData.append("defaultDifficulty", defaultDifficulty);

    setFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));
    setUploadProgress(10);
    bulkUploadMutation.mutate(formData);
  };

  const getStatusIcon = (status: FileStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Question Documents</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger data-testid="select-subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="chapter">Chapter</Label>
              <Input
                data-testid="input-chapter"
                id="chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="Enter chapter name"
              />
            </div>
            
            <div>
              <Label htmlFor="difficulty">Default Difficulty</Label>
              <Select value={defaultDifficulty} onValueChange={setDefaultDifficulty}>
                <SelectTrigger data-testid="select-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragOver 
                ? "border-primary bg-primary/5" 
                : files.length > 0 
                  ? "border-blue-300 bg-blue-50" 
                  : "border-neutral-300 hover:border-primary"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById("bulk-file-input")?.click()}
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CloudUpload className="text-primary text-2xl" />
            </div>
            <h4 className="text-lg font-medium text-neutral-800 mb-2">
              Drag and drop multiple documents here
            </h4>
            <p className="text-neutral-600 mb-4">or click to browse files</p>
            <p className="text-sm text-neutral-500">
              Supports .docx, .doc, .txt, .pdf files (up to 10 files, 10MB each)
            </p>
            <input
              id="bulk-file-input"
              type="file"
              className="hidden"
              multiple
              accept=".doc,.docx,.txt,.pdf"
              onChange={(e) => {
                if (e.target.files) {
                  handleFilesSelect(e.target.files);
                }
              }}
            />
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-800">Selected Files ({files.length})</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {files.map((fileStatus, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(fileStatus.status)}
                      <div>
                        <p className="font-medium text-sm">{fileStatus.file.name}</p>
                        <p className="text-xs text-neutral-500">
                          {(fileStatus.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {fileStatus.result && (
                          <p className="text-xs text-green-600">
                            {fileStatus.result.questionsCount} questions parsed
                          </p>
                        )}
                        {fileStatus.error && (
                          <p className="text-xs text-red-600">{fileStatus.error}</p>
                        )}
                      </div>
                    </div>
                    {fileStatus.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        data-testid={`button-remove-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {bulkUploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Processing documents...</span>
                <span className="text-sm text-neutral-600">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={files.length === 0 || !subject || !chapter || bulkUploadMutation.isPending}
              data-testid="button-upload"
            >
              {bulkUploadMutation.isPending ? "Processing..." : `Upload ${files.length} Files`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}