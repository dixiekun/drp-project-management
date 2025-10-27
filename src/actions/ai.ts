"use server";

import { GoogleGenAI } from "@google/genai";
import { db } from "@/db";
import { projects, documents } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askAI(projectId: string, question: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get project details
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      client: true,
    },
  });

  if (!project) throw new Error("Project not found");

  // Get project documents
  const projectDocs = await db.query.documents.findMany({
    where: eq(documents.projectId, projectId),
  });

  // Build context from project and documents
  const context = `
Project Context:
- Name: ${project.name}
- Client: ${project.client.name}
- Description: ${project.description || "No description"}
- Status: ${project.status}
- Priority: ${project.priority}
- Budget: ${project.budget || "Not specified"}

${projectDocs.length > 0 ? `
Project Documents:
${projectDocs.map((doc, i) => `
Document ${i + 1}: ${doc.name}
${doc.content ? `Content: ${doc.content.substring(0, 1000)}...` : "Content not available"}
`).join("\n")}
` : "No documents uploaded for this project yet."}
`;

  // Generate response
  const prompt = `You are a helpful project management assistant. Based on the following project context, answer the user's question.

${context}

User Question: ${question}

Please provide a clear, concise, and helpful answer based on the project context provided.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const answer = response.text;

  return { answer, projectName: project.name };
}
