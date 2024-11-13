import { NextRequest, NextResponse } from "next/server";
import { generateIdea } from "./logic";
import topics from "@/app/idea/data/categories";
import { getAuthInfo, selectRandom } from "@/lib/utils";
import { createIdeaAndMarkAsSeen, getRandomIdea } from "@/lib/db/query/idea";
import { PartialIdeaSchema, PartialIdea } from "@/types/idea";
import { mockIdea } from "./mock";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/config";
import { userIdeaViews } from "@/lib/db/schema";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { ideas } from "@/lib/db/schema";

export const runtime = "edge";
const CACHE_TAG = "ideas";
const CACHE_REVALIDATE_SECONDS = 3600;

type IdeaWithViewStatus = PartialIdea & { viewed: boolean };

type Features = { title: string }[];

// Cache key generator
const getUserIdeasCacheKey = (userId: string) => `user_ideas:${userId}`;

/**
 * Retrieves an unviewed idea for a given topic from a list of ideas.
 *
 * @param ideas - An array of ideas with their view status.
 * @param topic - The topic to filter ideas by. If null, all topics are considered.
 * @returns A promise that resolves to an unviewed idea that matches the topic, or null if no such idea exists.
 */
async function getUnviewedIdeaForTopic(
  ideas: IdeaWithViewStatus[],
  topic: string | null,
): Promise<IdeaWithViewStatus | null> {
  topic = topic ? topic.toLowerCase() : "";
  const unviewedIdeas = ideas.filter(
    (idea) =>
      !idea.viewed &&
      (idea.title.toLowerCase().includes(topic) ||
        (idea.description && idea.description.toLowerCase().includes(topic))),
  );
  return unviewedIdeas.length > 0 ? selectRandom(unviewedIdeas) : null;
}

async function getIdeasWithViewStatus(
  userId: string,
): Promise<IdeaWithViewStatus[]> {
  const ideasWithViewStatus = await db
    .select({
      ...getTableColumns(ideas),
      viewed:
        sql`CASE WHEN ${userIdeaViews}.idea_id IS NOT NULL THEN true ELSE false END`.as(
          "viewed",
        ),
    })
    .from(ideas)
    .leftJoin(
      userIdeaViews,
      and(
        eq(ideas.id, userIdeaViews.idea_id),
        eq(userIdeaViews.user_id, userId),
      ),
    )
    .execute();

  return ideasWithViewStatus.map((idea) => ({
    ...idea,
    features: idea.features as Features | null,
    viewed: idea.viewed as boolean,
  }));
}

// Wrapper function that handles caching
const getCachedIdeasWithViewStatus = (userId: string) =>
  unstable_cache(
    async () => getIdeasWithViewStatus(userId),
    [`user_ideas:${userId}`],
    {
      tags: [CACHE_TAG],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )();

async function markIdeaAsViewed(userId: string, ideaId: number) {
  // Update database
  await db
    .insert(userIdeaViews)
    .values({ user_id: userId, idea_id: ideaId })
    .onConflictDoNothing()
    .execute();

  // Instead of trying to update the cache directly,
  // we force a revalidation of the cache for this user
  await unstable_cache(async () => null, [`user_ideas:${userId}`], {
    tags: [CACHE_TAG],
    revalidate: 0, // Force immediate revalidation
  })();
}

export async function GET(req: NextRequest) {
  try {
    if (process.env.MOCK_LLM === "true") {
      return NextResponse.json(mockIdea);
    }

    // Anonymous users get a random idea
    const { userId } = await getAuthInfo(req);
    if (!userId) {
      const randomIdea = await getRandomIdea();
      return NextResponse.json(randomIdea);
    }

    // Authenticated users get a random idea they haven't seen yet, if available
    const topic = req.nextUrl.searchParams.get("topic");
    const ideasWithViewStatus = await getCachedIdeasWithViewStatus(userId);
    let idea = await getUnviewedIdeaForTopic(ideasWithViewStatus, topic);
    if (idea) {
      await markIdeaAsViewed(userId, idea.id);
      // The next request will get fresh data
      return NextResponse.json(idea);
    }

    // No unviewed ideas, must generate new one
    const recentIdeas = ideasWithViewStatus
      .filter((idea) => idea.viewed)
      .slice(-6)
      .map((idea) => idea.title);

    const newIdea = await generateIdea(
      topic || selectRandom(topics),
      recentIdeas,
    );

    // Save new idea and mark as viewed
    const savedIdea = await createIdeaAndMarkAsSeen(newIdea, userId);

    // Update cache with new idea
    await unstable_cache(
      async () => {
        const currentCache = await getCachedIdeasWithViewStatus(userId);
        return [
          ...currentCache,
          {
            ...savedIdea,
            viewed: true,
            features: savedIdea.features as Features | null,
          },
        ];
      },
      [getUserIdeasCacheKey(userId)],
      {
        tags: ["ideas"],
        revalidate: 3600,
      },
    )();

    return NextResponse.json(savedIdea);
  } catch (e: any) {
    console.error("Error in idea route:", e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getAuthInfo(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedIdea = PartialIdeaSchema.safeParse(body);

    if (!parsedIdea.success) {
      return NextResponse.json(
        { error: "Invalid idea data", details: parsedIdea.error.errors },
        { status: 400 },
      );
    }

    const idea = await createIdeaAndMarkAsSeen(parsedIdea.data, userId);

    return NextResponse.json(
      { message: "Sucessfully created new idea", idea },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 },
    );
  }
}
