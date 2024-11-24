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

export async function GET(req: NextRequest) {
  console.time("total-request");
  try {
    // Check if MOCK_LLM is set and return mock data if true
    console.time("mock-check");
    if (process.env.MOCK_LLM === "true") {
      console.timeEnd("mock-check");
      console.timeEnd("total-request");
      return NextResponse.json(mockIdea);
    }
    console.timeEnd("mock-check");

    // Parse request parameters
    console.time("parse-params");
    let topic = req.nextUrl.searchParams.get("topic");
    console.timeEnd("parse-params");

    // Get auth info
    console.time("auth-check");
    const { userId } = await getAuthInfo(req);
    console.timeEnd("auth-check");

    if (!userId) {
      // User not logged in, fetch a random existing idea from DB
      console.time("get-random-idea");
      const idea = await getRandomIdea();
      console.timeEnd("get-random-idea");
      console.timeEnd("total-request");
      return NextResponse.json(idea);
    }

    // Check for unseen ideas
    console.time("get-unseen-idea");
    let idea = await getUnseenIdeaWithTopic(userId, topic);
    console.timeEnd("get-unseen-idea");

    if (!idea) {
      // Select random topic if none provided
      console.time("topic-selection");
      if (!topic) {
        topic = selectRandom(topics);
      }
      console.timeEnd("topic-selection");

      // Get recent ideas for context
      console.time("get-recent-ideas");
      const recentIdeas = await getLastSeenIdeasForUserAndTopic(
        userId,
        topic,
        6,
      );
      console.timeEnd("get-recent-ideas");

      // Generate new idea
      console.time("generate-idea");
      const generatedIdea = await generateIdea(topic, recentIdeas);
      console.timeEnd("generate-idea");

      // Save to DB and mark as seen
      console.time("save-idea");
      idea = await createIdeaAndMarkAsSeen(generatedIdea, userId);
      console.timeEnd("save-idea");
    }

    console.timeEnd("total-request");
    return NextResponse.json(idea);
  } catch (e: any) {
    console.timeEnd("total-request");
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

// const BYPASS_CACHE_TIME = 24 * 60 * 60; // 24 hours

// // Cache expensive database operations
// const cachedGetUnseenIdeaWithTopic = unstable_cache(
//   async (userId: string, topic: string | null) =>
//     getUnseenIdeaWithTopic(userId, topic),
//   ["unseen-idea"],
//   { revalidate: 60 }, // Revalidate every minute
// );

// const cachedGetLastSeenIdeasForUserAndTopic = unstable_cache(
//   async (userId: string, topic: string, limit: number) =>
//     getLastSeenIdeasForUserAndTopic(userId, topic, limit),
//   ["last-seen-ideas"],
//   { revalidate: 60 }, // Revalidate every minute
// );

// export async function GET(req: NextRequest) {
//   try {
//     if (process.env.MOCK_LLM === "true") {
//       return NextResponse.json(mockIdea);
//     }

//     const { userId } = await getAuthInfo(req);
//     if (!userId) {
//       const idea = await getRandomIdea();
//       return NextResponse.json(idea);
//     }

//     let topic = req.nextUrl.searchParams.get("topic");

//     const bypassCacheKey = `bypassUnseen-${userId}-${topic}`;
//     const bypassUnseen = await unstable_cache(
//       async () => false,
//       [bypassCacheKey],
//       {
//         tags: ["ideas"],
//         revalidate: BYPASS_CACHE_TIME,
//       },
//     )();

//     if (!bypassUnseen) {
//       const idea = await cachedGetUnseenIdeaWithTopic(userId, topic);
//       if (idea) {
//         await markIdeaAsViewed(userId, idea.id);
//         return NextResponse.json(idea);
//       } else {
//         await unstable_cache(async () => true, [bypassCacheKey], {
//           tags: ["ideas"],
//           revalidate: BYPASS_CACHE_TIME,
//         })();
//       }
//     }

//     topic = topic || selectRandom(topics);
//     const recentIdeas = await cachedGetLastSeenIdeasForUserAndTopic(
//       userId,
//       topic,
//       6,
//     );

//     const newIdea = await generateIdea(topic, recentIdeas);

//     return NextResponse.json(newIdea);
//   } catch (e: any) {
//     console.error("Error in GET /api/idea:", e);
//     return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
//   }
// }

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
