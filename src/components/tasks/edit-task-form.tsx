"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTask, deleteTask } from "@/actions/tasks";
import { getProjects } from "@/actions/projects";
import { toast } from "sonner";
import type { Task, Project } from "@/db/schema";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
  status: z.enum(["todo", "in_progress", "in_review", "done", "blocked"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.string().optional(),
  timeEstimate: z.string().optional(),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface EditTaskFormProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditTaskForm({ task, open, onOpenChange, onSuccess }: EditTaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      category: task.category || "",
      timeEstimate: task.timeEstimate?.toString() || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    },
  });

  const status = watch("status");
  const priority = watch("priority");
  const projectId = watch("projectId");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.filter((p: any) => p.status === "active" || p.status === "planning"));
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };

    if (open) {
      loadProjects();
    }
  }, [open]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const timeEstimate = data.timeEstimate ? parseInt(data.timeEstimate) * 60 : undefined;
      const dueDate = data.dueDate ? new Date(data.dueDate) : undefined;

      await updateTask(task.id, {
        ...data,
        timeEstimate,
        dueDate,
      });

      toast.success("Task updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Task title"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectId">Project *</Label>
              <Select value={projectId} onValueChange={(value) => setValue("projectId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-sm text-red-500 mt-1">{errors.projectId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setValue("status", value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setValue("priority", value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register("category")}
                placeholder="e.g. Design, Development"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeEstimate">Time Estimate (hours)</Label>
              <Input
                id="timeEstimate"
                type="number"
                {...register("timeEstimate")}
                placeholder="Hours"
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate")}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
            >
              {isDeleting ? "Deleting..." : "Delete Task"}
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isDeleting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
