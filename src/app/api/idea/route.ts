import { NextRequest, NextResponse } from "next/server";
import { generateIdea } from "./logic";
import topics from "@/app/idea/data/categories";
import { selectRandom } from "@/lib/utils";
import { getAuthInfo } from "@/lib/auth/user";
import {
  createIdeaAndMarkAsSeen,
  getRandomIdea,
  getUnseenIdeaWithTopic,
  getLastSeenIdeasForUserAndTopic,
} from "@/lib/db/query/idea";
import { mockIdea } from "./mock";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Check if MOCK_LLM is set and return mock data if true
    if (process.env.MOCK_LLM === "true") {
      return NextResponse.json(mockIdea);
    }

    let topic = req.nextUrl.searchParams.get("topic");
    const { userId } = await getAuthInfo(req);

    if (!userId) {
      // User not logged in, fetch a random existing idea from DB
      const idea = await getRandomIdea();
      return NextResponse.json(idea);
    }

    // Check for ideas user hasn't seen yet
    let idea = await getUnseenIdeaWithTopic(userId, topic);

    if (!idea) {
      // No unseen ideas in DB, so generate a new idea using GenAI
      if (!topic) {
        topic = selectRandom(topics);
      }
      const recentIdeas = await getLastSeenIdeasForUserAndTopic(
        userId,
        topic,
        6,
      );
      const generatedIdea = await generateIdea(topic, recentIdeas);
      // Add idea to DB
      idea = await createIdeaAndMarkAsSeen(generatedIdea, userId);
    }

    return NextResponse.json(idea);
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
