import { NextRequest, NextResponse } from "next/server";
import { getNewIdea } from "./logic";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(await getNewIdea());
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
