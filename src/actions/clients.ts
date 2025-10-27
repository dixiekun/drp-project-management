"use server";

import { db } from "@/db";
import { clients, type NewClient } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { syncCurrentUser } from "./users";

export async function createClient(data: Omit<NewClient, "id" | "createdBy" | "createdAt" | "updatedAt">) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure user exists in database
  await syncCurrentUser();

  const newClient = await db.insert(clients).values({
    ...data,
    createdBy: userId,
  }).returning();

  revalidatePath("/clients");
  return newClient[0];
}

export async function getClients() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.clients.findMany({
    orderBy: (clients, { desc }) => [desc(clients.createdAt)],
  });
}

export async function getClientById(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.clients.findFirst({
    where: eq(clients.id, id),
  });
}

export async function updateClient(id: string, data: Partial<NewClient>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const updated = await db
    .update(clients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(clients.id, id))
    .returning();

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  return updated[0];
}

export async function deleteClient(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(clients).where(eq(clients.id, id));
  revalidatePath("/clients");
}
