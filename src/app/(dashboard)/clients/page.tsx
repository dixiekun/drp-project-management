"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClientForm } from "@/components/clients/client-form";
import { getClients } from "@/actions/clients";
import { Plus, Mail, Phone, Building2 } from "lucide-react";
import { Toaster } from "sonner";
import type { Client } from "@/db/schema";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Failed to load clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

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

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      loadClients(); // Refresh clients after form closes
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Clients</h1>
            <p className="text-muted-foreground">
              Manage your client relationships
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-muted rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : clients.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No clients yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first client
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <Card
                key={client.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/clients/${client.id}`}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold truncate">{client.name}</h3>
                      <Badge
                        variant="outline"
                        className={getStatusColor(client.status)}
                      >
                        {client.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {client.company && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {client.company}
                      </p>
                    )}
                    <div className="mt-3 space-y-1">
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ClientForm open={isFormOpen} onOpenChange={handleFormClose} />
    </>
  );
}
