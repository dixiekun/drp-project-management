"use server";

import { db } from "@/db";
import { documents, type NewDocument } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { syncCurrentUser } from "./users";

export async function createDocument(data: Omit<NewDocument, "id" | "uploadedBy" | "createdAt" | "updatedAt">) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure user exists in database
  await syncCurrentUser();

  const newDocument = await db.insert(documents).values({
    ...data,
    uploadedBy: userId,
  }).returning();

  revalidatePath(`/projects/${data.projectId}`);
  return newDocument[0];
}

export async function getDocumentsByProjectId(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.documents.findMany({
    where: eq(documents.projectId, projectId),
    orderBy: (documents, { desc }) => [desc(documents.createdAt)],
    with: {
      uploadedByUser: true,
    },
  });
}

export async function deleteDocument(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const document = await db.query.documents.findFirst({
    where: eq(documents.id, id),
  });

  if (!document) throw new Error("Document not found");

  await db.delete(documents).where(eq(documents.id, id));
  revalidatePath(`/projects/${document.projectId}`);
}

export async function updateDocumentContent(id: string, content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const updated = await db
    .update(documents)
    .set({ content, updatedAt: new Date() })
    .where(eq(documents.id, id))
    .returning();

  if (updated[0]) {
    revalidatePath(`/projects/${updated[0].projectId}`);
  }

  return updated[0];
}
