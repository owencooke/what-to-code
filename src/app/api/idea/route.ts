import { NextRequest, NextResponse } from "next/server";
import { generateIdea } from "./logic";
import topics from "@/app/idea/data/categories";
import { getAuthInfo, selectRandom } from "@/lib/utils";
import {
  getUnseenIdeaWithTopic,
  getRandomIdea,
  createIdeaAndMarkAsSeen,
  getLastSeenIdeasForUser,
} from "@/lib/db/query/idea";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
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
      const recentIdeas = await getLastSeenIdeasForUser(userId, 6);
      idea = await generateIdea(
        topic,
        recentIdeas.map((idea) => idea.title),
      );
      // Add idea to DB
      idea = await createIdeaAndMarkAsSeen(idea, userId);
    }

    return NextResponse.json(idea);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
