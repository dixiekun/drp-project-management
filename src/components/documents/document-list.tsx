"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Trash2, ExternalLink } from "lucide-react";
import { deleteDocument } from "@/actions/documents";
import { toast } from "sonner";
import type { Document } from "@/db/schema";

interface DocumentListProps {
  documents: Array<Document & { uploadedByUser: { name: string | null } }>;
  onUpdate: () => void;
}

export function DocumentList({ documents, onUpdate }: DocumentListProps) {
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteDocument(id);
      toast.success("Document deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete document");
      console.error(error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("text")) return "📝";
    return "📎";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Project Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm mt-2">
              Upload documents for AI to analyze and provide context
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(doc.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span>
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                      {doc.uploadedByUser.name && (
                        <>
                          <span>•</span>
                          <span>{doc.uploadedByUser.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {doc.content && (
                    <Badge variant="secondary" className="text-xs">
                      AI Ready
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(doc.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc.id, doc.name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
