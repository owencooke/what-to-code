import { NextRequest, NextResponse } from "next/server";
import { generateIdea, expandIdea } from "./logic";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const topic = req.nextUrl.searchParams.get("topic");
    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required for generating an idea" },
        { status: 400 },
      );
    }
    const response = await generateIdea(topic);
    return NextResponse.json(response);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required for expanding an idea" },
        { status: 400 },
      );
    }
    const response = await expandIdea(title, description);
    return NextResponse.json(response);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
