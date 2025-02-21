import { NextRequest, NextResponse } from "next/server";
import { expandFeatures } from "../../logic";
import { IdeaSchema } from "@/types/idea";
import { mockFeatures } from "../mock";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Check if MOCK_LLM is set and return mock data if true
    if (process.env.MOCK_LLM === "true") {
      return NextResponse.json(mockFeatures);
    }

    const body = await req.json();
    const parsedIdea = IdeaSchema.safeParse(body);

    if (!parsedIdea.success) {
      return NextResponse.json(
        { error: "Invalid idea data", details: parsedIdea.error.errors },
        { status: 400 },
      );
    }

    const features = await expandFeatures(parsedIdea.data);
    return NextResponse.json(features);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
