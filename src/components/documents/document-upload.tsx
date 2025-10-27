"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, FileText, Loader2 } from "lucide-react";
import { createDocument } from "@/actions/documents";
import { toast } from "sonner";

interface DocumentUploadProps {
  projectId: string;
  onSuccess: () => void;
}

export function DocumentUpload({ projectId, onSuccess }: DocumentUploadProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // Upload files to R2
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { files: uploadedFiles } = await response.json();

      // Save to database
      for (const file of uploadedFiles) {
        await createDocument({
          projectId,
          name: file.name,
          type: file.type,
          size: file.size,
          url: file.url,
          content: file.content,
        });
      }

      toast.success(`${uploadedFiles.length} document(s) uploaded successfully`);
      setOpen(false);
      setFiles([]);
      onSuccess();
    } catch (error) {
      toast.error("Failed to upload documents");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <Upload className="mr-2 h-4 w-4" />
        Upload Documents
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Project Documents</DialogTitle>
            <DialogDescription>
              Upload documents for AI to analyze (PDF, TXT, Images)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-hidden">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to select files or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, TXT, Images (max 16MB per file)
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 overflow-hidden">
                <p className="text-sm font-medium">Selected files:</p>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm p-2 bg-muted rounded overflow-hidden"
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate overflow-hidden text-ellipsis whitespace-nowrap">
                        {file.name}
                      </span>
                      <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setFiles([]);
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {files.length > 0 && `(${files.length})`}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
