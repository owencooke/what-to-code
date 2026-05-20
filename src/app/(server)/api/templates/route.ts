import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { matchTemplates } from "@/app/(server)/db/query/templates";
import { getGitHubRepoDetails } from "@/app/(server)/integration/github/repo";
import { TemplateMatch } from "@/types/templates";
import { GitHubRepo } from "@/types/github";
import { getAuthInfo } from "@/app/(server)/integration/auth/user";

export const runtime = "edge";
const SIMILARITY_THRESHOLD = 0.4;
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? "gemini-embedding-2";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function GET(req: NextRequest) {
  const techDescription = req.nextUrl.searchParams.get("techDescription");
  const { accessToken } = await getAuthInfo(req);

  if (!techDescription) {
    return NextResponse.json(
      { message: "Description is required" },
      { status: 400 },
    );
  }

  const query = techDescription as string;

  try {
    // Embed using @google/genai which exposes outputDimensionality,
    // truncating to 1536 to match the DB vector column and HNSW index limit
    const result = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: query,
      config: { outputDimensionality: 1536 },
    });
    const embedding = result.embeddings?.[0]?.values;
    if (!embedding) {
      return NextResponse.json(
        { message: "Failed to generate embedding" },
        { status: 500 },
      );
    }

    // Use vector search to find the 3 most similar templates to the description
    let templateDocuments;
    try {
      templateDocuments = await matchTemplates(embedding, 3);
    } catch (error: any) {
      return NextResponse.json(
        { message: `Error performing RAG on repo templates: ${error.message}` },
        { status: 400 },
      );
    }

    // Get full details from Github for the top matching templates
    const repoTemplates: GitHubRepo[] = await Promise.all(
      templateDocuments
        .filter(
          (template: TemplateMatch) =>
            template.similarity >= SIMILARITY_THRESHOLD,
        )
        .map((template: TemplateMatch) =>
          getGitHubRepoDetails(template.url, accessToken),
        ),
    );

    return NextResponse.json(repoTemplates);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message, details: e.details },
      { status: e.status ?? 500 },
    );
  }
}