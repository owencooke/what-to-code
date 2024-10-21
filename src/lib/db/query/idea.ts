import { supabase } from "@/lib/db/config";
import { selectRandom } from "@/lib/utils";
import { PartialIdea } from "@/types/idea";

/**
 * Fetches a random idea that the user hasn't seen yet.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<PartialIdea | null>} - A promise that resolves to a random idea or null if no unseen ideas are found.
 * @throws {Error} - Throws an error if the query fails.
 */
async function getUnseenIdeaWithTopic(
  userId: string,
  topic: string | null,
): Promise<PartialIdea | null> {
  // Build the SQL query with a subquery
  let sql = `
      SELECT * FROM ideas
      WHERE id NOT IN (
        SELECT idea_id FROM user_idea_views WHERE user_id = $1
      )`;

  // Add topic filter if topic is not null
  if (topic) {
    sql += ` AND description ILIKE $2`;
  }

  // Execute the SQL query with parameters
  const { data, error } = await supabase.rpc("execute_sql", {
    query: topic ? [userId, `%${topic}%`] : [userId],
  });

  if (error) {
    console.error("Error fetching unseen ideas:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null; // No unseen ideas for user OR no ideas found for topic
  }

  return selectRandom(data);
}

/**
 * Fetches the last X seen ideas for a user.
 * Used to provide a list of recently seen ideas to avoid GenAI duplicates.
 *
 * @param {string} userId - The ID of the user.
 * @param {number} limit - The number of recent seen ideas to fetch.
 * @returns {Promise<PartialIdea[]>} - A promise that resolves to an array of ideas.
 * @throws {Error} - Throws an error if the query fails.
 */
async function getLastSeenIdeasForUser(
  userId: string,
  limit: number,
): Promise<PartialIdea[]> {
  type QueryResult = {
    idea_id: number;
    ideas: PartialIdea;
  };

  const { data: seenIdeas, error } = await supabase
    .from("user_idea_views")
    .select(
      `
        idea_id,
        ideas:ideas(*)
      `,
    )
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching seen ideas:", error);
    throw error;
  }
  console.log(seenIdeas);

  if (!seenIdeas || seenIdeas.length === 0) {
    return []; // No seen ideas found for the user
  }

  return [];
  // Assert the type of seenIdeas and map to extract just the ideas
  //   return (seenIdeas as QueryResult[]).map((item) => item.ideas);
}

/**
 * Fetches a list of ideas from the "ideas" table in the Supabase database
 * and returns a randomly selected idea.
 *
 * @returns {Promise<PartialIdea>} A promise that resolves to a randomly selected idea.
 * @throws Will throw an error if there is an issue fetching ideas from the database.
 */
async function getRandomIdea(): Promise<PartialIdea> {
  const { data: ideas, error } = await supabase.from("ideas").select("*");

  if (error) {
    console.error("Error fetching ideas:", error);
    throw error;
  }

  return selectRandom(ideas);
}

/**
 * Adds a new idea to the database and associates it with a user as seen.
 *
 * @param {PartialIdea} idea - The idea to be added to the database.
 * @param {string} userId - The ID of the user who has seen the idea.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 * @throws {Error} - Throws an error if the insertion fails.
 */
async function createIdeaAndMarkAsSeen(
  idea: PartialIdea,
  userId: string,
): Promise<void> {
  // Insert new idea
  const { data: insertedIdea, error: insertError } = await supabase
    .from("ideas")
    .insert([idea])
    .select("id")
    .single();

  if (insertError) {
    console.error("Error inserting new idea:", insertError);
    throw insertError;
  }

  // Add user-seen relationship
  const { error: userSeenError } = await supabase
    .from("user_idea_views")
    .insert([{ user_id: userId, idea_id: insertedIdea.id }]);

  if (userSeenError) {
    console.error("Error adding user-seen relationship:", userSeenError);
    throw userSeenError;
  }
}

export {
  getUnseenIdeaWithTopic,
  getRandomIdea,
  createIdeaAndMarkAsSeen,
  getLastSeenIdeasForUser,
};
