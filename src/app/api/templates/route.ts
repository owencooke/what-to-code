import { NextRequest, NextResponse } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { matchTemplates } from "@/lib/db/query/templates";
import { getGitHubRepoDetails } from "@/lib/github/repo";
import { TemplateMatch } from "@/types/templates";
import { GitHubRepo } from "@/types/github";
import { getAuthInfo } from "@/lib/auth/user";

export const runtime = "edge";
const SIMILARITY_THRESHOLD = 0.4;

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
    // Generate an embedding for the description
    const embeddings = new OpenAIEmbeddings({
      modelName: process.env.EMBEDDING_MODEL,
    });
    const embedding = await embeddings.embedQuery(query);

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
