import { generateZodSchemaFromPrompt } from "@/app/(server)/integration/llm/utils";
import { NextRequest, NextResponse } from "next/server";
import { IdeaOutputSchema } from "../logic";

const REFINE_IDEA_PROMPT = `
    You are a startup idea critic, helping aspiring software project founders 
    craft the next best project idea.

    You will be given the project idea and a description of the founder's feedback 
    that they crucially need your help with. Your job is to refine the original idea
    based on the feedback given.

    Idea: {idea}
    Feedback: {feedback}
`;

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.idea || !body.refinePrompt) {
      return NextResponse.json({ error: "Invalid idea data" }, { status: 400 });
    }
    const { idea, refinePrompt } = body;

    const refinedIdea = await generateZodSchemaFromPrompt(
      IdeaOutputSchema,
      REFINE_IDEA_PROMPT,
      { idea, feedback: refinePrompt },
    );

    return NextResponse.json(refinedIdea);
  } catch (error) {
    console.error("Error refining idea:", error);
    return NextResponse.json(
      { error: "Failed to refine idea" },
      { status: 500 },
    );
  }
}
