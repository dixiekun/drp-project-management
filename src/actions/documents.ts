"use server";

import { db } from "@/db";
import { documents, type NewDocument } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { syncCurrentUser } from "./users";
import { createClient } from "@libsql/client";

// Cache the client to reuse connection
let cachedClient: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!cachedClient) {
    cachedClient = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return cachedClient;
}

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

  console.log("Starting documents query with HTTP...");
  const start = Date.now();

  // Use HTTP fetch directly - bypass libsql WebSocket
  try {
    const tursoUrl = process.env.TURSO_DATABASE_URL!.replace('libsql://', 'https://');
    const response = await fetch(`${tursoUrl}/v2/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql: 'SELECT id, project_id, name, type, size, url, uploaded_by, created_at, updated_at FROM documents WHERE project_id = ? ORDER BY created_at DESC',
              args: [{ type: 'text', value: projectId }],
            },
          },
        ],
      }),
    });

    const data = await response.json();
    console.log(`HTTP query completed in ${Date.now() - start}ms`);

    if (data.results?.[0]?.response?.result?.rows) {
      return data.results[0].response.result.rows.map((row: any) => ({
        id: row[0].value,
        projectId: row[1].value,
        name: row[2].value,
        type: row[3].value,
        size: row[4].value,
        url: row[5].value,
        uploadedBy: row[6].value,
        createdAt: row[7].value,
        updatedAt: row[8].value,
        content: null, // Excluded from query for performance
      }));
    }

    return [];
  } catch (error) {
    console.error(`HTTP query failed after ${Date.now() - start}ms:`, error);
    throw error;
  }
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

export async function getDocumentsWithContentByProjectId(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  console.log("Fetching documents with content for AI...");
  const start = Date.now();

  try {
    const tursoUrl = process.env.TURSO_DATABASE_URL!.replace('libsql://', 'https://');
    const response = await fetch(`${tursoUrl}/v2/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql: 'SELECT id, name, content FROM documents WHERE project_id = ? AND content IS NOT NULL ORDER BY created_at DESC',
              args: [{ type: 'text', value: projectId }],
            },
          },
        ],
      }),
    });

    const data = await response.json();
    console.log(`Documents with content fetched in ${Date.now() - start}ms`);

    if (data.results?.[0]?.response?.result?.rows) {
      return data.results[0].response.result.rows.map((row: any) => ({
        id: row[0].value,
        name: row[1].value,
        content: row[2].value,
      }));
    }

    return [];
  } catch (error) {
    console.error(`Failed to fetch documents with content:`, error);
    throw error;
  }
}
