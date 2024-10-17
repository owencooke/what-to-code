import { NextRequest, NextResponse } from "next/server";
import { generateIdea } from "./logic";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const topic = req.nextUrl.searchParams.get("topic");
    const { recentIdeas } = await req.json();
    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required for generating an idea" },
        { status: 400 },
      );
    }
    const response = await generateIdea(topic, recentIdeas);
    return NextResponse.json(response);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
