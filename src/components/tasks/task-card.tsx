"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, AlertCircle } from "lucide-react";
import type { Task } from "@/db/schema";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
          {task.priority !== "medium" && (
            <Badge
              variant="outline"
              className={`${getPriorityColor(task.priority)} text-xs shrink-0`}
            >
              {task.priority}
            </Badge>
          )}
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {task.assigneeId ? (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {getInitials(task.assigneeId)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-muted">
                  ?
                </AvatarFallback>
              </Avatar>
            )}
            {task.timeEstimate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {Math.floor(task.timeEstimate / 60)}h
              </div>
            )}
          </div>
          {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done" && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />
              Overdue
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
