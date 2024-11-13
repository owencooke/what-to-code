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

export async function GET(req: NextRequest) {
  try {
    // Check if MOCK_LLM is set and return mock data if true
    if (process.env.MOCK_LLM === "true") {
      return NextResponse.json(mockIdea);
    }

    // Unauthorized users can only fetch random ideas
    const { userId } = await getAuthInfo(req);
    if (!userId) {
      const idea = await getRandomIdea();
      return NextResponse.json(idea);
    }

    let topic = req.nextUrl.searchParams.get("topic");

    // Try to show user an unseen idea first
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
      const idea = await getUnseenIdeaWithTopic(userId, topic);
      if (idea) {
        markIdeaAsViewed(userId, idea.id);
        return NextResponse.json(idea);
      } else {
        // Set the bypass flag in the cache
        // This is to avoid Vercel gateway timeouts from too long DB calls
        await unstable_cache(async () => true, [bypassCacheKey], {
          tags: ["ideas"],
          revalidate: BYPASS_CACHE_TIME,
        })();
      }
    }

    // Otherwise, generate a brand new idea using GenAI
    topic = topic || selectRandom(topics);
    const recentIdeas = await getLastSeenIdeasForUserAndTopic(userId, topic, 6);
    let newIdea = await generateIdea(topic, recentIdeas);
    newIdea = await createIdeaAndMarkAsSeen(newIdea, userId, topic);

    return NextResponse.json(newIdea);
  } catch (e: any) {
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
