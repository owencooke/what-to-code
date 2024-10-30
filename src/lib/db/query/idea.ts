import { and, desc, eq, ilike, not, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/config";
import { ideas, userIdeaViews } from "@/lib/db/schema";
import { selectRandom } from "@/lib/utils";
import { PartialIdea, PartialIdeaSchema } from "@/types/idea";
import { subDays, isAfter } from "date-fns";

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
 * Retrieves the most recently viewed ideas for a specific user.
 * Clears view history if user hasn't viewed any ideas in the last 3 days.
 *
 * @param userId - The unique identifier of the user.
 * @param limit - The maximum number of ideas to retrieve.
 * @returns {Promise<PartialIdea[]>} - A promise that resolves to an array of partially parsed ideas.
 */
async function getLastSeenIdeasForUser(
  userId: string,
  limit: number,
): Promise<PartialIdea[]> {
  const seenIdeas = await db
    .select({
      idea: ideas,
      viewed_at: userIdeaViews.viewed_at,
    })
    .from(userIdeaViews)
    .innerJoin(ideas, eq(userIdeaViews.idea_id, ideas.id))
    .where(eq(userIdeaViews.user_id, userId))
    .orderBy(desc(userIdeaViews.viewed_at))
    .limit(limit);

  // Check if the most recent seen idea is more than 3 days old
  if (seenIdeas.length) {
    const mostRecentViewDate = seenIdeas[0].viewed_at;
    const threeDaysAgo = subDays(new Date(), 3);

    if (isAfter(threeDaysAgo, mostRecentViewDate)) {
      // Clear view history for user
      await db.delete(userIdeaViews).where(eq(userIdeaViews.user_id, userId));
      return [];
    }
  }

  return seenIdeas.map((record) => PartialIdeaSchema.parse(record.idea));
}

/**
 * Fetches a random idea from all ideas.
 *
 * @returns {Promise<PartialIdea>} - A promise that resolves to a random idea.
 * @throws {Error} - Throws an error if the query fails.
 */
async function getRandomIdea(): Promise<PartialIdea> {
  const allIdeas = await db.select().from(ideas);
  return PartialIdeaSchema.parse(selectRandom(allIdeas));
}

/**
 * Adds a new idea to the database and associates it with a user as seen.
 *
 * @param {PartialIdea} idea - The idea to add to the database.
 * @param {string} userId - The ID of the user who has seen the idea.
 * @returns {Promise<PartialIdea>} - A promise that resolves to the inserted idea.
 * @throws {Error} - Throws an error if the insertion fails.
 */
async function createIdeaAndMarkAsSeen(
  idea: PartialIdea,
  userId: string,
): Promise<PartialIdea> {
  const insertedIdea = await db.transaction(async (tx) => {
    // Insert the new idea
    const [newIdea] = await tx.insert(ideas).values(idea).returning();

    // Create the user-idea view record
    await tx.insert(userIdeaViews).values({
      user_id: userId,
      idea_id: newIdea.id,
    });

    return newIdea;
  });

  return PartialIdeaSchema.parse(insertedIdea);
}

/**
 * Fetches ideas from the database based on an optional search query and topics.
 *
 * @param {string | undefined} query - The optional search query to filter ideas by title or description.
 * @param {string | string[] | undefined} topics - The optional topics to filter ideas by.
 * @returns {Promise<PartialIdea[]>} - A promise that resolves to an array of ideas.
 */
async function searchIdeas(
  query: string | undefined,
  topics: string | string[] | undefined,
): Promise<PartialIdea[]> {
  const conditions = [];

  // Add search query conditions
  if (query) {
    conditions.push(
      or(
        ilike(ideas.title, `%${query}%`),
        ilike(ideas.description, `%${query}%`),
      ),
    );
  }

  console.log({ topics });

  // Add tags conditions
  if (topics) {
    if (!Array.isArray(topics)) {
      topics = [topics];
    }
    conditions.push(
      or(
        ...topics.map((topic) =>
          or(
            ilike(ideas.title, `%${topic}%`),
            ilike(ideas.description, `%${topic}%`),
          ),
        ),
      ),
    );
  }

  // Build the final query with all conditions
  const result = await db
    .select()
    .from(ideas)
    .where(and(...conditions));

  return result.map((record) => PartialIdeaSchema.parse(record));
}

async function getIdeaById(id: number): Promise<PartialIdea> {
  const idea = await db.select().from(ideas).where(eq(ideas.id, id));
  return PartialIdeaSchema.parse(idea[0]);
}

export {
  getIdeaById,
  searchIdeas,
  getUnseenIdeaWithTopic,
  getRandomIdea,
  createIdeaAndMarkAsSeen,
  getLastSeenIdeasForUser,
};
