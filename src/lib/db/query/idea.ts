import { and, desc, eq, ilike, not, sql } from "drizzle-orm";
import { db } from "@/lib/db/config"; // Assuming this is where your drizzle db instance is configured
import { ideas, userIdeaViews } from "@/lib/db/schema";
import { selectRandom } from "@/lib/utils";
import { PartialIdea, PartialIdeaSchema } from "@/types/idea";

/**
 * Fetches a random idea that the user hasn't seen yet.
 *
 * @param {string} userId - The ID of the user.
 * @param {string | null} topic - The topic to filter ideas by.
 * @returns {Promise<PartialIdea | null>} - A promise that resolves to a random idea or null if no unseen ideas are found.
 * @throws {Error} - Throws an error if the query fails.
 */
async function getUnseenIdeaWithTopic(
  userId: string,
  topic: string | null,
): Promise<PartialIdea | null> {
  // Get all idea IDs that the user has seen
  const seenIdeasSubquery = db
    .select({ ideaId: userIdeaViews.idea_id })
    .from(userIdeaViews)
    .where(eq(userIdeaViews.user_id, userId));

  // Build the conditions array
  const conditions = [not(sql`${ideas.id} IN (${seenIdeasSubquery})`)];

  // Add topic filter if provided
  if (topic) {
    conditions.push(ilike(ideas.description, `%${topic}%`));
  }

  // Execute query with all conditions
  const unseenIdeas = await db
    .select()
    .from(ideas)
    .where(and(...conditions));

  if (!unseenIdeas.length) {
    return null;
  }

  return PartialIdeaSchema.parse(selectRandom(unseenIdeas));
}

/**
 * Fetches the last X seen ideas for a user.
 */
async function getLastSeenIdeasForUser(
  userId: string,
  limit: number,
): Promise<PartialIdea[]> {
  const seenIdeas = await db
    .select({
      idea: ideas,
    })
    .from(userIdeaViews)
    .innerJoin(ideas, eq(userIdeaViews.idea_id, ideas.id))
    .where(eq(userIdeaViews.user_id, userId))
    .orderBy(desc(userIdeaViews.viewed_at))
    .limit(limit);

  return seenIdeas.map((record) => PartialIdeaSchema.parse(record.idea));
}

/**
 * Fetches a random idea from all ideas.
 */
async function getRandomIdea(): Promise<PartialIdea> {
  const allIdeas = await db.select().from(ideas);
  return PartialIdeaSchema.parse(selectRandom(allIdeas));
}

/**
 * Adds a new idea to the database and associates it with a user as seen.
 */
async function createIdeaAndMarkAsSeen(
  idea: PartialIdea,
  userId: string,
): Promise<void> {
  // Use a transaction to ensure both operations succeed or fail together
  await db.transaction(async (tx) => {
    // Insert the new idea
    const [insertedIdea] = await tx
      .insert(ideas)
      .values(idea)
      .returning({ id: ideas.id });

    // Create the user-idea view record
    await tx.insert(userIdeaViews).values({
      user_id: userId,
      idea_id: insertedIdea.id,
    });
  });
}

export {
  getUnseenIdeaWithTopic,
  getRandomIdea,
  createIdeaAndMarkAsSeen,
  getLastSeenIdeasForUser,
};
