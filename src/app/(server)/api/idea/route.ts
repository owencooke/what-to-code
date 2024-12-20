import { NextRequest, NextResponse } from "next/server";
import { generateIdea } from "./logic";
import { CATEGORIES } from "@/lib/constants/categories";
import { selectRandom } from "@/lib/utils";
import { getAuthInfo } from "@/app/(server)/integration/auth/user";
import {
  createIdeaAndMarkAsSeen,
  getRandomIdea,
  getUnseenIdeaWithTopic,
  getLastSeenIdeasForUserAndTopic,
} from "@/app/(server)/db/query/idea";
import { mockIdea } from "./mock";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  console.time("total-request");
  try {
    // Check if MOCK_LLM is set and return mock data if true
    if (process.env.MOCK_LLM === "true") {
      return NextResponse.json(mockIdea);
    }

    let topic = req.nextUrl.searchParams.get("topic");
    const { userId } = await getAuthInfo(req);
    if (!userId) {
      // User not logged in, fetch a random existing idea from DB
      console.time("get-random-idea");
      const idea = await getRandomIdea();
      console.timeEnd("get-random-idea");
      console.timeEnd("total-request");
      return NextResponse.json(idea);
    }

    // Check for unseen existing idea
    console.time("get-unseen-idea");
    let idea = await getUnseenIdeaWithTopic(userId, topic);
    console.timeEnd("get-unseen-idea");
    if (idea) {
      console.timeEnd("total-request");
      return NextResponse.json(idea);
    }

    // Otherwise, generate a new idea
    if (!topic) {
      topic = selectRandom(CATEGORIES);
    }

    // Get recent ideas for context
    console.time("get-recent-ideas");
    const recentIdeas = await getLastSeenIdeasForUserAndTopic(userId, topic, 6);
    console.timeEnd("get-recent-ideas");

    // Generate new idea
    console.time("generate-idea");
    const newIdea = await generateIdea(topic, recentIdeas);
    console.timeEnd("generate-idea");

    console.timeEnd("total-request");
    return NextResponse.json(newIdea);
  } catch (e: any) {
    console.timeEnd("total-request");
    console.error("Error fetching idea:", e);
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
