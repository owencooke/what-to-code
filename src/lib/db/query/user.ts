import { db } from "@/lib/db/config";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Creates a new user in the database if they do not already exist.
 *
 * @param {string} userId - The GitHub user ID (from Next Auth token).
 * @param {string} githubUsername - The GitHub username of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<void>} - A promise that resolves when check or insert complete.
 * @throws {Error} - Throws an error if the insertion fails.
 */
async function createUserIfNotExist(
  userId: string,
  githubUsername: string,
  email: string,
): Promise<void> {
  // Check if the user already exists
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, githubUsername));

  if (!existingUser) {
    // Insert a new user
    const [newUser] = await db
      .insert(users)
      .values({ id: userId, username: githubUsername, email })
      .returning({ id: users.id });

    if (!newUser) {
      throw new Error("Error inserting new user");
    }
  }
}

/**
 * Fetches the user ID from the database using the GitHub username.
 *
 * @param {string} githubUsername - The GitHub username of the user.
 * @returns {Promise<string | null>} - A promise that resolves to the user ID or null if not found.
 * @throws {Error} - Throws an error if the query fails.
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
