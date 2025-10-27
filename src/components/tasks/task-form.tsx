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
  DialogDescription,
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
import { createTask } from "@/actions/tasks";
import { getProjects } from "@/actions/projects";
import { toast } from "sonner";
import type { Project } from "@/db/schema";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
  status: z.enum(["todo", "in_progress", "in_review", "done", "blocked"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  category: z.string().optional(),
  timeEstimate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectId?: string;
  defaultStatus?: string;
}

export function TaskForm({ open, onOpenChange, defaultProjectId, defaultStatus }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: (defaultStatus as any) || "todo",
      priority: "medium",
      projectId: defaultProjectId || "",
    },
  });

  const status = watch("status");
  const priority = watch("priority");
  const projectId = watch("projectId");
  const category = watch("category");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.filter((p: any) => p.status === "active" || p.status === "planning"));
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    if (open) {
      loadProjects();
    }
  }, [open]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await createTask({
        title: data.title,
        description: data.description || null,
        projectId: data.projectId,
        status: data.status,
        priority: data.priority,
        category: data.category || null,
        timeEstimate: data.timeEstimate ? parseInt(data.timeEstimate) * 60 : null,
      });
      toast.success("Task created successfully");
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your project board.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Task Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Design homepage header"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">
              Project <span className="text-destructive">*</span>
            </Label>
            <Select
              value={projectId}
              onValueChange={(value) => setValue("projectId", value)}
              disabled={isLoadingProjects || !!defaultProjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                    {project.client && ` - ${project.client.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectId && (
              <p className="text-sm text-destructive">{errors.projectId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task details..."
              {...register("description")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue("status", value as TaskFormData["status"])
                }
              >
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

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setValue("priority", value as TaskFormData["priority"])
                }
              >
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="frontend">Front-end</SelectItem>
                  <SelectItem value="backend">Back-end</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeEstimate">Time Estimate (hours)</Label>
              <Input
                id="timeEstimate"
                type="number"
                placeholder="2"
                {...register("timeEstimate")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
