import { NextRequest, NextResponse } from "next/server";
import { generateIdea } from "./logic";
import topics from "@/app/idea/data/categories";
import { getAuthInfo, selectRandom } from "@/lib/utils";
import { createIdeaAndMarkAsSeen } from "@/lib/db/query/idea";
import { PartialIdeaSchema, PartialIdea } from "@/types/idea";
import { mockIdea } from "./mock";
import { unstable_cache, revalidateTag } from "next/cache";
import { db } from "@/lib/db/config";
import { userIdeaViews } from "@/lib/db/schema";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { ideas } from "@/lib/db/schema";

export const runtime = "edge";

type IdeaWithViewStatus = PartialIdea & { viewed: boolean };

type Features = { title: string }[];

// Cache key generator
const getUserIdeasCacheKey = (userId: string) => `user_ideas:${userId}`;

// Cache function for getting all ideas with view status
const getCachedIdeasWithViewStatus = unstable_cache(
  async (userId: string): Promise<IdeaWithViewStatus[]> => {
    // Use SQL join to get all ideas with view status
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
    tags: ["ideas"], // For cache invalidation
    revalidate: 3600, // Cache for 1 hour
  },
);

// Function to get a random unviewed idea
async function getRandomUnviewedIdea(
  ideas: IdeaWithViewStatus[],
): Promise<IdeaWithViewStatus | null> {
  const unviewedIdeas = ideas.filter((idea) => !idea.viewed);
  return unviewedIdeas.length > 0 ? selectRandom(unviewedIdeas) : null;
}

// Function to get a completely random idea (for anonymous users)
async function getRandomIdea(): Promise<typeof ideas.$inferSelect> {
  const [idea] = await db
    .select()
    .from(ideas)
    .orderBy(sql`RANDOM()`)
    .limit(1)
    .execute();

  return idea;
}

// Function to mark idea as viewed and update cache
async function markIdeaAsViewed(userId: string, ideaId: number) {
  // Update database
  await db
    .insert(userIdeaViews)
    .values({ user_id: userId, idea_id: ideaId })
    .onConflictDoNothing()
    .execute();

  // Revalidate cache
  revalidateTag(getUserIdeasCacheKey(userId));
}

export async function GET(req: NextRequest) {
  try {
    if (process.env.MOCK_LLM === "true") {
      return NextResponse.json(mockIdea);
    }

    const { userId } = await getAuthInfo(req);

    // For anonymous users, return a random idea without caching
    if (!userId) {
      const randomIdea = await getRandomIdea();
      return NextResponse.json(randomIdea);
    }

    // Get cached ideas with view status
    const ideasWithViewStatus = await getCachedIdeasWithViewStatus(userId);

    // Try to get an unviewed idea
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

      // Revalidate cache after adding new idea
      revalidateTag(getUserIdeasCacheKey(userId));
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
