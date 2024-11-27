import { NextRequest, NextResponse } from "next/server";
import { NewProjectSchema } from "@/types/project";
import { createRepoFromTemplate } from "@/app/(server)/integration/github/repo";
import { createIssue } from "@/app/(server)/integration/github/issue";
import { Feature } from "@/types/project";
import { createProject, searchProjects } from "@/app/(server)/db/query/project";
import { getAuthInfo } from "@/app/(server)/integration/auth/user";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query") || "";

    const projects = await searchProjects(query, []);

    return NextResponse.json(projects);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

export async function POST(req: NextRequest) {
  const project = await req.json();
  const { accessToken } = await getAuthInfo(req);

  // Validate project data
  if (!NewProjectSchema.safeParse(project).success) {
    return NextResponse.json(
      { message: "Invalid new project schema format" },
      { status: 400 },
    );
  }

  try {
    // Create new GitHub repo for user based on selected framework
    const repo: any = await createRepoFromTemplate(project, accessToken);

    // Create GitHub enhancement issues for each feature in the project
    project.features.forEach(
      async (feature: Feature) =>
        await createIssue(repo.name, project.github_user, feature, accessToken),
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
