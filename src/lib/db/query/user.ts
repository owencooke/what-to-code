import { db } from "@/lib/db/config";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Checks if a user exists in the database and creates a new user if not.
 *
 * @param {string} userId - The GitHub user ID (from Next Auth token).
 * @param {string} githubUsername - The GitHub username of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<{ status: string; userId: string }>} - A promise that resolves to an object indicating the result of the operation.
 * @throws {Error} - Throws an error if the insertion fails.
 */
async function createUserIfNotExist(
  userId: string,
  githubUsername: string,
  email: string,
): Promise<{ status: string; userId: string }> {
  // Check if the user already exists
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, githubUsername));

  if (existingUser) {
    return { status: "found", userId: existingUser.id };
  }

  // Insert a new user
  const [newUser] = await db
    .insert(users)
    .values({ id: userId, username: githubUsername, email })
    .returning({ id: users.id });

  if (!newUser) {
    throw new Error("Error inserting new user");
  }

  return { status: "created", userId: newUser.id };
}

/**
 * Fetches the user ID from the database using the GitHub username.
 *
 * @param {string} githubUsername - The GitHub username of the user.
 * @returns {Promise<string | null>} - A promise that resolves to the user ID or null if not found.
 */
async function getUserIdByGithubUsername(
  githubUsername: string,
): Promise<string | null> {
  try {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, githubUsername));

    return user?.id || null;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
}

export { createUserIfNotExist, getUserIdByGithubUsername };
