"use server";

import { db } from "@/db";
import { projects, type NewProject } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProject(
  data: Omit<NewProject, "id" | "createdBy" | "createdAt" | "updatedAt">
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const newProject = await db
    .insert(projects)
    .values({
      ...data,
      createdBy: userId,
    })
    .returning();

  revalidatePath("/projects");
  revalidatePath(`/clients/${data.clientId}`);
  return newProject[0];
}

export async function getProjects() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.projects.findMany({
    with: {
      client: true,
    },
    orderBy: (projects, { desc }) => [desc(projects.createdAt)],
  });
}

export async function getProjectById(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      client: true,
    },
  });
}

export async function getProjectsByClientId(clientId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.projects.findMany({
    where: eq(projects.clientId, clientId),
    orderBy: (projects, { desc }) => [desc(projects.createdAt)],
  });
}

export async function updateProject(id: string, data: Partial<NewProject>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const updated = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  if (data.clientId) {
    revalidatePath(`/clients/${data.clientId}`);
  }
  return updated[0];
}

export async function deleteProject(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const project = await getProjectById(id);
  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/projects");
  if (project?.clientId) {
    revalidatePath(`/clients/${project.clientId}`);
  }
}
