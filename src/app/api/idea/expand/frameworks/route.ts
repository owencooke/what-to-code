import { NextRequest, NextResponse } from "next/server";
import { expandFrameworks } from "../../logic";
import { PartialIdeaSchema } from "@/types/idea";
import { mockFrameworks } from "../mock";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Check if MOCK_LLM is set and return mock data if true
    if (process.env.MOCK_LLM) {
      return NextResponse.json(mockFrameworks);
    }

    const body = await req.json();
    const parsedIdea = PartialIdeaSchema.safeParse(body);

    if (!parsedIdea.success) {
      return NextResponse.json(
        { error: "Invalid idea data", details: parsedIdea.error.errors },
        { status: 400 },
      );
    }

    const frameworks = await expandFrameworks(parsedIdea.data);
    return NextResponse.json(frameworks);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
