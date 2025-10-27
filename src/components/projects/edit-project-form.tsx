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
import { updateProject } from "@/actions/projects";
import { getClients } from "@/actions/clients";
import { toast } from "sonner";
import type { Project, Client } from "@/db/schema";

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  clientId: z.string().min(1, "Client is required"),
  status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface EditProjectFormProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditProjectForm({
  project,
  open,
  onOpenChange,
  onSuccess,
}: EditProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
      clientId: project.clientId,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : "",
      endDate: project.endDate
        ? new Date(project.endDate).toISOString().split("T")[0]
        : "",
    },
  });

  const status = watch("status");
  const priority = watch("priority");
  const clientId = watch("clientId");

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClients(data.filter((c) => c.status === "active"));
      } catch (error) {
        console.error("Failed to load clients:", error);
      } finally {
        setIsLoadingClients(false);
      }
    };
    if (open) {
      loadClients();
    }
  }, [open]);

  useEffect(() => {
    reset({
      name: project.name,
      description: project.description || "",
      clientId: project.clientId,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : "",
      endDate: project.endDate
        ? new Date(project.endDate).toISOString().split("T")[0]
        : "",
    });
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      await updateProject(project.id, {
        name: data.name,
        description: data.description || null,
        clientId: data.clientId,
        status: data.status,
        priority: data.priority,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      });
      toast.success("Project updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update project");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update project information and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Website Redesign"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">
              Client <span className="text-destructive">*</span>
            </Label>
            <Select
              value={clientId}
              onValueChange={(value) => setValue("clientId", value)}
              disabled={isLoadingClients}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                    {client.company && ` (${client.company})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-sm text-destructive">
                {errors.clientId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief project description..."
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
                  setValue("status", value as ProjectFormData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setValue("priority", value as ProjectFormData["priority"])
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
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
