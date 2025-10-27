"use server";

import { db } from "@/db";
import { users, type NewUser } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function syncCurrentUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Check if user exists in database
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (existingUser) {
    return existingUser;
  }

  // Get user details from Clerk
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("User not found");

  // Create user in database
  const newUser = await db.insert(users).values({
    id: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress || "",
    name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "User",
    avatarUrl: clerkUser.imageUrl,
    role: "owner", // First user is owner
  }).returning();

  return newUser[0];
}

export async function getUser(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
}
