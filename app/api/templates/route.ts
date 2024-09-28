import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { OpenAIEmbeddings } from "@langchain/openai";
import ky from "ky";
import { GitHubRepo } from "@/types/github";

export const runtime = "edge";
const SIMILARITY_THRESHOLD = 0.4;

export async function GET(req: NextRequest) {
  const techDescription = req.nextUrl.searchParams.get("techDescription");
  const authHeader = req.headers.get("Authorization")!;

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

    // Use RAG for the 3 most similar templates
    const { data: templateDocuments, error } = await supabase.rpc(
      "match_templates",
      {
        query_embedding: embedding,
        match_count: 3, // Return the top 3 matches
      },
    );

    if (error) {
      return NextResponse.json(
        { message: `Error performing RAG on repo templates: ${error.message}` },
        { status: 400 },
      );
    }

    // Process the RAG results
    const repoTemplates = await Promise.all(
      templateDocuments
        .filter((template: any) => template.similarity >= SIMILARITY_THRESHOLD)
        .map(async (template: any): Promise<GitHubRepo> => {
          // Extract the owner and repo name from the URL
          const { url } = template;
          const urlParts = new URL(url);
          const [owner, repoName] = urlParts.pathname.split("/").slice(1, 3);

          try {
            // Fetch repo details from GitHub API
            const repo: any = await ky
              .get(`https://api.github.com/repos/${owner}/${repoName}`, {
                headers: {
                  Authorization: authHeader,
                },
              })
              .json();

            // Return the GitHub repo info for matching template
            return {
              url,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              createdAt: repo.created_at,
              updatedAt: repo.updated_at,
              topics: repo.topics,
              description: repo.description,
              name: repo.name,
            };
          } catch (error) {
            console.error(`Error fetching GitHub data for ${url}:`, error);
            return { ...template, githubInfo: null }; // Return template even if GitHub fetch fails
          }
        }),
    );

    return NextResponse.json(repoTemplates);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message, details: e.details },
      { status: e.status ?? 500 },
    );
  }
}
