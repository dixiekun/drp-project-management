"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/task-form";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { getTasks } from "@/actions/tasks";
import { Plus, LayoutGrid } from "lucide-react";
import { Toaster } from "sonner";
import type { Task } from "@/db/schema";

export default function TasksPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const data = await getTasks();
      return data as Task[];
    },
  });

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  };

  const handleTasksChange = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your tasks with a Kanban board
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-24 bg-muted rounded"></div>
                  <div className="h-24 bg-muted rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first task to get started with the Kanban board
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </Card>
        ) : (
          <KanbanBoard tasks={tasks} onTasksChange={handleTasksChange} />
        )}
      </div>

      <TaskForm open={isFormOpen} onOpenChange={handleFormClose} />
    </>
  );
}
