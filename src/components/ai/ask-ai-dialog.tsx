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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Loader2, Trash2 } from "lucide-react";
import { askAI } from "@/actions/ai";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface AskAIDialogProps {
  projectId: string;
  projectName: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AskAIDialog({ projectId, projectName }: AskAIDialogProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage on mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`ai-chat-${projectId}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localStorage whenever they change
  const saveMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    if (typeof window !== "undefined") {
      localStorage.setItem(`ai-chat-${projectId}`, JSON.stringify(newMessages));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();
    setQuestion("");

    const userMessage = { role: "user" as const, content: userQuestion };
    saveMessages([...messages, userMessage]);
    setIsLoading(true);

    try {
      const response = await askAI(projectId, userQuestion);
      const assistantMessage = { role: "assistant" as const, content: response.answer || "No response" };
      saveMessages([...messages, userMessage, assistantMessage]);
    } catch (error) {
      toast.error("Failed to get AI response");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Don't clear messages on close - they persist in localStorage
  };

  const handleClearChat = () => {
    if (confirm("Clear all chat messages? This cannot be undone.")) {
      saveMessages([]);
      toast.success("Chat cleared");
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2"
        variant="outline"
      >
        <Sparkles className="h-4 w-4" />
        Ask AI
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Ask AI about {projectName}
                </DialogTitle>
                <DialogDescription>
                  Ask questions about this project. AI has access to project details and uploaded documents.
                </DialogDescription>
              </div>
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  className="h-8 w-8"
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-[300px]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">
                    Start a conversation with AI
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Example: &quot;What&apos;s the status of this project?&quot; or &quot;Summarize the project documents&quot;
                  </p>
                </div>
              </div>
            ) : null}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Badge variant="secondary" className="mb-2 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Assistant
                    </Badge>
                  )}
                  {message.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Assistant
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this project..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !question.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
