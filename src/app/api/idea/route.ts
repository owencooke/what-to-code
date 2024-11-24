import { NextRequest, NextResponse } from "next/server";
import { generateIdea } from "./logic";
import topics from "@/app/idea/data/categories";
import { getAuthInfo, selectRandom } from "@/lib/utils";
import {
  createIdeaAndMarkAsSeen,
  getRandomIdea,
  getUnseenIdeaWithTopic,
  getLastSeenIdeasForUserAndTopic,
  markIdeaAsViewed,
} from "@/lib/db/query/idea";
import { PartialIdeaSchema } from "@/types/idea";
import { mockIdea } from "./mock";
import { unstable_cache } from "next/cache";

export const runtime = "edge";
const BYPASS_CACHE_TIME = 24 * 60 * 60; // 24 hours

// Cache expensive database operations
const cachedGetUnseenIdeaWithTopic = unstable_cache(
  async (userId: string, topic: string | null) =>
    getUnseenIdeaWithTopic(userId, topic),
  ["unseen-idea"],
  { revalidate: 60 }, // Revalidate every minute
);

const cachedGetLastSeenIdeasForUserAndTopic = unstable_cache(
  async (userId: string, topic: string, limit: number) =>
    getLastSeenIdeasForUserAndTopic(userId, topic, limit),
  ["last-seen-ideas"],
  { revalidate: 60 }, // Revalidate every minute
);

export async function GET(req: NextRequest) {
  try {
    if (process.env.MOCK_LLM === "true") {
      return NextResponse.json(mockIdea);
    }

    const { userId } = await getAuthInfo(req);
    if (!userId) {
      const idea = await getRandomIdea();
      return NextResponse.json(idea);
    }

    let topic = req.nextUrl.searchParams.get("topic");

    const bypassCacheKey = `bypassUnseen-${userId}-${topic}`;
    const bypassUnseen = await unstable_cache(
      async () => false,
      [bypassCacheKey],
      {
        tags: ["ideas"],
        revalidate: BYPASS_CACHE_TIME,
      },
    )();

    if (!bypassUnseen) {
      const idea = await cachedGetUnseenIdeaWithTopic(userId, topic);
      if (idea) {
        await markIdeaAsViewed(userId, idea.id);
        return NextResponse.json(idea);
      } else {
        await unstable_cache(async () => true, [bypassCacheKey], {
          tags: ["ideas"],
          revalidate: BYPASS_CACHE_TIME,
        })();
      }
    }

    topic = topic || selectRandom(topics);
    const recentIdeas = await cachedGetLastSeenIdeasForUserAndTopic(
      userId,
      topic,
      6,
    );

    const newIdea = await generateIdea(topic, recentIdeas);

    return NextResponse.json(newIdea);
  } catch (e: any) {
    console.error("Error in GET /api/idea:", e);
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

    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Invalid idea data" }, { status: 400 });
    }

    const idea = await createIdeaAndMarkAsSeen(body, userId);

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
