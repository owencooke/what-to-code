import { and, desc, eq, ilike, not, or, sql } from "drizzle-orm";
import { db } from "@/app/(server)/lib/db/config";
import {
  ideas,
  userIdeaViews,
  topics,
  ideaTopics,
} from "@/app/(server)/lib/db/schema";
import { selectRandom } from "@/app/(server)/lib/utils";
import { NewPartialIdea, PartialIdea, PartialIdeaSchema } from "@/types/idea";
import { subDays } from "date-fns";

/**
 * Fetches an unseen idea for a user with a specific topic.
 *
 * @param userId - The unique identifier of the user.
 * @param topic - The topic to filter ideas by.
 * @returns {Promise<PartialIdea | null>} - A promise that resolves to an unseen idea or null if none found.
 */
async function getUnseenIdeaWithTopic(
  userId: string,
  topic: string | null,
): Promise<PartialIdea | null> {
  // Execute a single query with all conditions, order by random and limit to 1
  const unseenIdeas = await db
    .select()
    .from(ideas)
    .innerJoin(ideaTopics, eq(ideas.id, ideaTopics.idea_id))
    .innerJoin(topics, eq(ideaTopics.topic_id, topics.id))
    .leftJoin(
      userIdeaViews,
      and(
        eq(userIdeaViews.idea_id, ideas.id),
        eq(userIdeaViews.user_id, userId),
      ),
    )
    .where(
      and(
        sql`${userIdeaViews.idea_id} IS NULL`,
        topic ? ilike(topics.name, `%${topic}%`) : sql`TRUE`,
      ),
    )
    .limit(1);

  if (unseenIdeas.length === 0) {
    return null;
  }

  return PartialIdeaSchema.parse(unseenIdeas[0].ideas);
}

/**
 * Retrieves the most recently viewed ideas for a specific user, in last 3 days.
 *
 * TODO: might need a job to clear idea views for inactive users / more than 3 days old.
 *
 * @param userId - The unique identifier of the user.
 * @param topic - The topic to filter ideas by.
 * @param limit - The maximum number of ideas to retrieve.
 * @returns {Promise<PartialIdea[]>} - A promise that resolves to an array of partially parsed ideas.
 */
async function getLastSeenIdeasForUserAndTopic(
  userId: string,
  topic: string | null,
  limit: number,
): Promise<PartialIdea[]> {
  const threeDaysAgo = subDays(new Date(), 3);

  const seenIdeas = await db
    .select({
      idea: ideas,
      viewed_at: userIdeaViews.viewed_at,
    })
    .from(userIdeaViews)
    .innerJoin(ideas, eq(userIdeaViews.idea_id, ideas.id))
    .innerJoin(ideaTopics, eq(ideas.id, ideaTopics.idea_id))
    .innerJoin(topics, eq(ideaTopics.topic_id, topics.id))
    .where(
      and(
        eq(userIdeaViews.user_id, userId),
        sql`${userIdeaViews.viewed_at} > ${threeDaysAgo}`,
        topic ? eq(topics.name, topic) : sql`TRUE`,
      ),
    )
    .orderBy(desc(userIdeaViews.viewed_at))
    .limit(limit);

  return seenIdeas.map((record) => PartialIdeaSchema.parse(record.idea));
}

/**
 * Fetches a random idea from all ideas.
 *
 * @returns {Promise<PartialIdea>} - A promise that resolves to a random idea.
 * @throws {Error} - Throws an error if the query fails.
 */
async function getRandomIdea(): Promise<PartialIdea> {
  const randomIdea = await db
    .select()
    .from(ideas)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (randomIdea.length === 0) {
    throw new Error("No ideas found");
  }

  return PartialIdeaSchema.parse(randomIdea[0]);
}

/**
 * Adds a new idea to the database and associates it with a user as seen.
 *
 * @param idea - The idea to add to the database.
 * @param userId - The ID of the user who has seen the idea.
 * @returns {Promise<PartialIdea>} - A promise that resolves to the inserted idea.
 * @throws {Error} - Throws an error if the insertion fails.
 */
async function createIdeaAndMarkAsSeen(
  idea: NewPartialIdea,
  userId: string,
  topic: string | null = null,
): Promise<PartialIdea> {
  const insertedIdea = await db.transaction(async (tx) => {
    // Insert the new idea
    const [newIdea] = await tx.insert(ideas).values(idea).returning();

    // Insert the idea-topic association
    if (topic) {
      // Check if the topic already exists
      const [existingTopic] = await tx
        .select()
        .from(topics)
        .where(eq(topics.name, topic))
        .limit(1);

      let topicId;
      if (existingTopic) {
        // If the topic exists, use its ID
        topicId = existingTopic.id;
      } else {
        // If the topic does not exist, insert it and get the new ID
        const [newTopic] = await tx
          .insert(topics)
          .values({ name: topic })
          .returning();
        topicId = newTopic.id;
      }

      // Insert the idea-topic mapping
      await tx.insert(ideaTopics).values({
        idea_id: newIdea.id,
        topic_id: topicId,
      });
    }

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

  // Add topics conditions
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

async function markIdeaAsViewed(userId: string, ideaId: number) {
  await db
    .insert(userIdeaViews)
    .values({ user_id: userId, idea_id: ideaId })
    .onConflictDoNothing()
    .execute();
}

export {
  markIdeaAsViewed,
  getIdeaById,
  searchIdeas,
  getUnseenIdeaWithTopic,
  getRandomIdea,
  createIdeaAndMarkAsSeen,
  getLastSeenIdeasForUserAndTopic,
};
