"use server";

import { db } from "@/db";
import { tasks, type NewTask } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTask(
  data: Omit<NewTask, "id" | "createdAt" | "updatedAt">
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get the max position for the status column
  const maxPosition = await db.query.tasks.findFirst({
    where: and(
      eq(tasks.projectId, data.projectId),
      eq(tasks.status, data.status || "todo")
    ),
    orderBy: [desc(tasks.position)],
  });

  const newTask = await db
    .insert(tasks)
    .values({
      ...data,
      position: (maxPosition?.position || 0) + 1,
      reporterId: userId,
    })
    .returning();

  revalidatePath("/tasks");
  revalidatePath(`/projects/${data.projectId}`);
  return newTask[0];
}

export async function getTasks() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.tasks.findMany({
    with: {
      project: {
        with: {
          client: true,
        },
      },
      assignee: true,
      reporter: true,
    },
    orderBy: [desc(tasks.createdAt)],
  });
}

export async function getTasksByProjectId(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.tasks.findMany({
    where: eq(tasks.projectId, projectId),
    with: {
      assignee: true,
      reporter: true,
    },
    orderBy: [tasks.position],
  });
}

export async function getTaskById(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    with: {
      project: {
        with: {
          client: true,
        },
      },
      assignee: true,
      reporter: true,
    },
  });
}

export async function updateTask(id: string, data: Partial<NewTask>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const updated = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();

  revalidatePath("/tasks");
  if (updated[0]?.projectId) {
    revalidatePath(`/projects/${updated[0].projectId}`);
  }
  return updated[0];
}

export async function updateTaskStatus(
  id: string,
  status: string,
  position: number
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const updated = await db
    .update(tasks)
    .set({
      status: status as any,
      position,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id))
    .returning();

  revalidatePath("/tasks");
  if (updated[0]?.projectId) {
    revalidatePath(`/projects/${updated[0].projectId}`);
  }
  return updated[0];
}

export async function deleteTask(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const task = await getTaskById(id);
  await db.delete(tasks).where(eq(tasks.id, id));

  revalidatePath("/tasks");
  if (task?.projectId) {
    revalidatePath(`/projects/${task.projectId}`);
  }
}
