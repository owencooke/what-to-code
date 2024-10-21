import { db } from "@/lib/db/config";

/**
 * Creates a user in the database if they don't already exist.
 *
 * @param {string} userId - The GitHub user ID (from Next Auth token).
 * @param {string} username - The GitHub username.
 * @param {string} email - The user's email.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 * @throws {Error} - Throws an error if the operation fails.
 */
async function createUserIfNotExist(
  userId: string,
  username: string,
  email: string,
): Promise<void> {
  const { data } = await db
    .select(["id"])
    .from("users")
    .eq("id", userId)
    .single();

  if (!data) {
    // User does not exist, insert new user
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        username: username,
        email: email,
      },
    ]);

    if (insertError) {
      console.error("Error inserting new user:", insertError);
      throw insertError;
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
  const { data, error } = await db
    .select(["id"])
    .from("users")
    .eq("username", githubUsername)
    .single();

  if (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }

  return data?.id || null;
}

export { createUserIfNotExist, getUserIdByGithubUsername };
