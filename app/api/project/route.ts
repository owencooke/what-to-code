import { NextRequest, NextResponse } from "next/server";
import { ProjectSchema } from "@/types/project";
import { createIssue, createRepoFromTemplate } from "./github";
import { Feature } from "@/types/idea";
import { createProject } from "./db";

export async function POST(req: NextRequest) {
  const project = await req.json();
  const authHeader = req.headers.get("Authorization")!;

  // Validate project data
  if (!ProjectSchema.safeParse(project).success) {
    return NextResponse.json(
      { message: "Invalid project schema format" },
      { status: 400 },
    );
  }

  try {
    const projectId = await createProject(project, authHeader);

    // Create new GitHub repo for user based on selected framework
    const repo = await createRepoFromTemplate(project, authHeader);

    // Create GitHub enhancement issues for each feature in the project
    project.features.forEach(async (feature: Feature) => {
      await createIssue(repo.name, feature, authHeader);
    });

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

// const execPromise = promisify(exec);
//   // Check if repository already exists
//   const reposResponse = await axios.get("https://api.github.com/user/repos", {
//     headers: {
//       Authorization: `token ${accessToken}`,
//       Accept: "application/vnd.github.v3+json",
//     },
//   });

//   const repoExists = reposResponse.data.some(
//     (repo: any) => repo.name === repoName,
//   );

//   if (repoExists) {
//     return NextResponse.json(
//       { message: `Repository ${repoName} already exists` },
//       { status: 400 },
//     );
//   }
//   try {
//     const response = await axios.post(
//       "https://api.github.com/user/repos",
//       { name: repoName },
//       {
//         headers: {
//           Authorization: `token ${accessToken}`,
//           Accept: "application/vnd.github.v3+json",
//         },
//       },
//     );

//     const repoFullName = response.data.full_name;
//     const commands = viteReactCommands(repoFullName);
//     for (const command of commands) {
//       const { stdout, stderr } = await execPromise(command);
//     }
