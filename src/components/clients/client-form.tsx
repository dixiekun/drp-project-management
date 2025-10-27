"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/actions/clients";
import { toast } from "sonner";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "on_hold", "archived"]).default("active"),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientForm({ open, onOpenChange }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: "active",
    },
  });

  const status = watch("status");

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      await createClient({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        website: data.website || null,
        status: data.status,
      });
      toast.success("Client created successfully");
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create client");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client profile to manage projects and tasks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 234 567 8900"
                {...register("phone")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue("status", value as ClientFormData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              {...register("company")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              {...register("website")}
            />
            {errors.website && (
              <p className="text-sm text-destructive">
                {errors.website.message}
              </p>
            )}
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
              {isSubmitting ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
