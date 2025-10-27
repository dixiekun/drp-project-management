"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskForm } from "@/components/tasks/task-form";
import { EditProjectForm } from "@/components/projects/edit-project-form";
import { AskAIDialog } from "@/components/ai/ask-ai-dialog";
import { DocumentUpload } from "@/components/documents/document-upload";
import { DocumentList } from "@/components/documents/document-list";
import { getProjectById, deleteProject } from "@/actions/projects";
import { getTasksByProjectId } from "@/actions/tasks";
import { getDocumentsByProjectId } from "@/actions/documents";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Trash2,
  Plus,
  CheckSquare,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import type { Project, Task } from "@/db/schema";

type ProjectWithClient = Project & {
  client: {
    id: string;
    name: string;
    company: string | null;
  };
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithClient | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const loadProject = async () => {
    try {
      const projectData = await getProjectById(params.id as string);

      if (projectData) {
        setProject(projectData as ProjectWithClient);

        const tasksData = await getTasksByProjectId(params.id as string);
        setTasks(tasksData as Task[]);

        const docsData = await getDocumentsByProjectId(params.id as string);
        setDocuments(docsData);
      } else {
        toast.error("Project not found");
        router.push("/projects");
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      toast.error("Failed to load project");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [params.id]);

  const handleDelete = async () => {
    if (!project) return;

    if (
      !confirm(
        `Are you sure you want to delete "${project.name}"? This will also delete all tasks. This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      toast.success("Project deleted successfully");
      router.push("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleTaskFormClose = (open: boolean) => {
    setIsTaskFormOpen(open);
    if (!open) {
      loadProject();
    }
  };

  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalTimeEstimate = tasks.reduce((sum, t) => sum + (t.timeEstimate || 0), 0);
  const totalTimeTracked = tasks.reduce((sum, t) => sum + (t.timeTracked || 0), 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        </div>
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-1/3 bg-muted rounded"></div>
            <div className="h-4 w-1/4 bg-muted rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/projects")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-semibold">{project.name}</h1>
              <p className="text-muted-foreground">
                {project.client.name}
                {project.client.company && ` - ${project.client.company}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <AskAIDialog projectId={project.id} projectName={project.name} />
            <DocumentUpload projectId={project.id} onSuccess={loadProject} />
            <Button variant="outline" onClick={() => setIsEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className={getStatusColor(project.status)}
              >
                {project.status.replace("_", " ")}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className={getPriorityColor(project.priority)}
              >
                {project.priority}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedTasks}/{totalTasks}
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(totalTimeTracked / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">
                of {Math.floor(totalTimeEstimate / 60)}h estimated
              </p>
            </CardContent>
          </Card>
        </div>

        {project.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </CardContent>
          </Card>
        )}

        <DocumentList documents={documents} onUpdate={loadProject} />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <Button onClick={() => setIsTaskFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first task for this project
              </p>
              <Button onClick={() => setIsTaskFormOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </Card>
        ) : (
          <KanbanBoard tasks={tasks} onTasksChange={loadProject} />
        )}
      </div>

      <TaskForm
        open={isTaskFormOpen}
        onOpenChange={handleTaskFormClose}
        defaultProjectId={project.id}
      />

      {project && (
        <EditProjectForm
          project={project}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSuccess={loadProject}
        />
      )}
    </>
  );
}
