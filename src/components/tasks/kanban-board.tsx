"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./task-card";
import { EditTaskForm } from "./edit-task-form";
import type { Task } from "@/db/schema";

interface KanbanBoardProps {
  tasks: Task[];
  onTasksChange: () => void;
}

const columns = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-100" },
  { id: "in_review", title: "In Review", color: "bg-yellow-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
];

export function KanbanBoard({ tasks, onTasksChange }: KanbanBoardProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <div key={column.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  {column.title}
                </h3>
                <Badge variant="secondary" className="rounded-full">
                  {columnTasks.length}
                </Badge>
              </div>

              <div className="flex-1 space-y-2 min-h-[200px] p-3 rounded-lg bg-muted/20">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => setEditingTask(task)} />
                ))}
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editingTask && (
        <EditTaskForm
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onSuccess={onTasksChange}
        />
      )}
    </>
  );
}
