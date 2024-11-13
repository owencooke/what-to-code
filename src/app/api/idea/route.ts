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

type IdeaWithViewStatus = PartialIdea & { viewed: boolean };

type Features = { title: string }[];

// Cache key generator
const getUserIdeasCacheKey = (userId: string) => `user_ideas:${userId}`;

// Function to get a random unviewed idea
async function getRandomUnviewedIdea(
  ideas: IdeaWithViewStatus[],
): Promise<IdeaWithViewStatus | null> {
  const unviewedIdeas = ideas.filter((idea) => !idea.viewed);
  return unviewedIdeas.length > 0 ? selectRandom(unviewedIdeas) : null;
}

// Cache function for getting all ideas with view status (unchanged)
const getCachedIdeasWithViewStatus = unstable_cache(
  async (userId: string): Promise<IdeaWithViewStatus[]> => {
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
  },
  [],
  {
    tags: ["ideas"],
    revalidate: 3600,
  },
);

// Updated function to modify cache instead of invalidating it
async function markIdeaAsViewed(userId: string, ideaId: number) {
  // Update database
  await db
    .insert(userIdeaViews)
    .values({ user_id: userId, idea_id: ideaId })
    .onConflictDoNothing()
    .execute();

  // Get the current cache key
  const cacheKey = getUserIdeasCacheKey(userId);

  // Update the cache directly using unstable_cache
  await unstable_cache(
    async () => {
      // Get current cached data
      const currentCache = await getCachedIdeasWithViewStatus(userId);

      // Update the viewed status for the specific idea
      return currentCache.map((idea) =>
        idea.id === ideaId ? { ...idea, viewed: true } : idea,
      );
    },
    [cacheKey],
    {
      tags: ["ideas"],
      revalidate: 3600,
    },
  )();
}

export async function GET(req: NextRequest) {
  try {
    if (process.env.MOCK_LLM === "true") {
      return NextResponse.json(mockIdea);
    }

    const { userId } = await getAuthInfo(req);

    if (!userId) {
      const randomIdea = await getRandomIdea();
      return NextResponse.json(randomIdea);
    }

    const ideasWithViewStatus = await getCachedIdeasWithViewStatus(userId);
    let idea = await getRandomUnviewedIdea(ideasWithViewStatus);

    if (!idea) {
      // No unviewed ideas, generate new one
      const recentIdeas = ideasWithViewStatus
        .filter((idea) => idea.viewed)
        .slice(-6)
        .map((idea) => idea.title);

      const topic = selectRandom(topics);
      const newIdea = await generateIdea(topic, recentIdeas);

      // Save new idea and mark as viewed
      const [savedIdea] = await db.transaction(async (tx) => {
        const [newIdeaRecord] = await tx
          .insert(ideas)
          .values(newIdea)
          .returning();

        await tx
          .insert(userIdeaViews)
          .values({ user_id: userId, idea_id: newIdeaRecord.id })
          .execute();

        return [newIdeaRecord];
      });

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

      idea = {
        ...savedIdea,
        viewed: true,
        features: savedIdea.features as Features | null,
      };
    } else {
      // Mark the idea as viewed and update cache
      await markIdeaAsViewed(userId, idea.id);
    }

    return NextResponse.json(idea);
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
