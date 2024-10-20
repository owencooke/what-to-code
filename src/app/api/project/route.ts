import { NextRequest, NextResponse } from "next/server";
import { NewProjectSchema } from "@/types/project";
import { createIssue, createRepoFromTemplate } from "../../../lib/github/repo";
import { Feature } from "@/types/idea";
import { createProject, searchProjects } from "@/lib/db/query/project";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query") || "";

    const projects = await searchProjects(query);

    return NextResponse.json(projects);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export async function POST(req: NextRequest) {
  const project = await req.json();
  const authHeader = req.headers.get("Authorization")!;

  // Validate project data
  if (!NewProjectSchema.safeParse(project).success) {
    return NextResponse.json(
      { message: "Invalid new project schema format" },
      { status: 400 },
    );
  }

  try {
    // Create new GitHub repo for user based on selected framework
    const repo: any = await createRepoFromTemplate(project, authHeader);

    // Create GitHub enhancement issues for each feature in the project
    project.features.forEach(
      async (feature: Feature) =>
        await createIssue(repo.name, project.github_user, feature, authHeader),
    );

    // Add an entry to the projects table in the database
    const projectId = await createProject(project);

    return NextResponse.json({
      message: `Project created and repository pushed successfully!`,
      url: repo.html_url,
      projectId,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to create Github repository for project",
        error: error,
      },
      { status: 500 },
    );
  }
}
