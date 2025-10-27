"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/task-form";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { getTasks } from "@/actions/tasks";
import { Plus, LayoutGrid } from "lucide-react";
import { Toaster } from "sonner";
import type { Task } from "@/db/schema";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data as Task[]);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      loadTasks();
    }
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
          <KanbanBoard tasks={tasks} onTasksChange={loadTasks} />
        )}
      </div>

      <TaskForm open={isFormOpen} onOpenChange={handleFormClose} />
    </>
  );
}
