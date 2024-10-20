import { supabase } from "../config";

/**
 * Checks if a user exists in the Supabase users table and inserts the user if they do not exist.
 *
 * @param {string} username - The GitHub username of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 * @throws {Error} - Throws an error if the check or insert operation fails.
 */
async function createUserIfNotExist(
  username: string,
  email: string,
): Promise<void> {
  // Check if user exists already
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (!data) {
    // User does not exist, insert new user
    const { error: insertError } = await supabase.from("users").insert([
      {
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

export { createUserIfNotExist };
