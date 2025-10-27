"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EditClientForm } from "@/components/clients/edit-client-form";
import { ProjectForm } from "@/components/projects/project-form";
import { getClientById, deleteClient } from "@/actions/clients";
import { getProjectsByClientId } from "@/actions/projects";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Globe,
  Pencil,
  Trash2,
  FolderKanban,
  Plus,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import type { Client, Project } from "@/db/schema";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const loadClient = async () => {
    try {
      const data = await getClientById(params.id as string);
      if (data) {
        setClient(data);
        const projectsData = await getProjectsByClientId(params.id as string);
        setProjects(projectsData);
      } else {
        toast.error("Client not found");
        router.push("/clients");
      }
    } catch (error) {
      console.error("Failed to load client:", error);
      toast.error("Failed to load client");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClient();
  }, [params.id]);

  const handleDelete = async () => {
    if (!client) return;

    if (!confirm(`Are you sure you want to delete ${client.name}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteClient(client.id);
      toast.success("Client deleted successfully");
      router.push("/clients");
    } catch (error) {
      console.error("Failed to delete client:", error);
      toast.error("Failed to delete client");
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "archived":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
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
            <div className="h-20 w-20 rounded-full bg-muted"></div>
            <div className="h-6 w-1/3 bg-muted rounded"></div>
            <div className="h-4 w-1/4 bg-muted rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!client) {
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
              onClick={() => router.push("/clients")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-semibold">{client.name}</h1>
              <p className="text-muted-foreground">Client Details</p>
            </div>
          </div>
          <div className="flex gap-2">
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

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{client.name}</h2>
                  {client.company && (
                    <p className="text-muted-foreground">{client.company}</p>
                  )}
                  <Badge
                    variant="outline"
                    className={`mt-2 ${getStatusColor(client.status)}`}
                  >
                    {client.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {client.email && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email</span>
                    </div>
                    <a
                      href={`mailto:${client.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {client.email}
                    </a>
                  </div>
                )}

                {client.phone && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">Phone</span>
                    </div>
                    <a
                      href={`tel:${client.phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}

                {client.company && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">Company</span>
                    </div>
                    <p className="text-sm">{client.company}</p>
                  </div>
                )}

                {client.website && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">Website</span>
                    </div>
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {client.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>
                      {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>
                      {new Date(client.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FolderKanban className="h-4 w-4" />
                    <span>Projects</span>
                  </div>
                  <span className="text-2xl font-bold">{projects.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <Button onClick={() => setIsProjectFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create a project for this client to get started
                </p>
                <Button onClick={() => setIsProjectFormOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => (window.location.href = `/projects/${project.id}`)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {project.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={
                          project.status === "active"
                            ? "bg-green-100 text-green-800"
                            : project.status === "planning"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    {project.endDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                        <Calendar className="h-3 w-3" />
                        Due {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {client && (
        <>
          <EditClientForm
            client={client}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSuccess={loadClient}
          />
          <ProjectForm
            open={isProjectFormOpen}
            onOpenChange={(open) => {
              setIsProjectFormOpen(open);
              if (!open) loadClient();
            }}
            defaultClientId={client.id}
          />
        </>
      )}
    </>
  );
}
