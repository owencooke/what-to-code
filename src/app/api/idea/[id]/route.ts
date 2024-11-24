import { NextRequest, NextResponse } from "next/server";
import { getIdeaById } from "@/lib/db/query/idea";

export const runtime = "edge";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: number } },
) {
  const { id } = params;

  try {
    const idea = await getIdeaById(id);
    return NextResponse.json(idea);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to fetch idea",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
