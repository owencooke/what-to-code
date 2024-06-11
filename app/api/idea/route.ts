import { NextRequest, NextResponse } from "next/server";
import { getNewIdea } from "./logic";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const topic = req.nextUrl.searchParams.get("topic");
    const newIdea = await getNewIdea(topic);
    return NextResponse.json(newIdea);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
