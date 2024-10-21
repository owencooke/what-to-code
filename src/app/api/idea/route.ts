import { NextRequest, NextResponse } from "next/server";
import { generateIdea } from "./logic";
import topics from "@/app/idea/data/categories";
import { selectRandom } from "@/lib/utils";
import {
  getUnseenIdeaWithTopic,
  getRandomIdea,
  createIdeaAndMarkAsSeen,
  getLastSeenIdeasForUser,
} from "@/lib/db/query/idea";
import { getToken } from "next-auth/jwt";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    let topic = req.nextUrl.searchParams.get("topic");
    const token = await getToken({ req });

    if (!token) {
      // User not logged in, fetch a random existing idea from DB
      const idea = await getRandomIdea();
      return NextResponse.json(idea);
    }

    // Check for ideas user hasn't seen yet
    const userId = token.sub as string;
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
      await createIdeaAndMarkAsSeen(idea, userId);
    }

    return NextResponse.json(idea);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
