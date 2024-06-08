import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

import { promisify } from "util";
import axios from "axios";

import { viteReactCommands, viteVueCommands } from "@/lib/commands";
import { error } from "console";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  const { repoName, accessToken } = await req.json();

  if (!repoName || !accessToken) {
    return NextResponse.json(
      { message: "Repository name and access token are required" },
      { status: 400 },
    );
  }

  // Check if repository already exists
  const reposResponse = await axios.get("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const repoExists = reposResponse.data.some(
    (repo: any) => repo.name === repoName,
  );

  if (repoExists) {
    return NextResponse.json(
      { message: `Repository ${repoName} already exists` },
      { status: 400 },
    );
  }
  try {
    const response = await axios.post(
      "https://api.github.com/user/repos",
      { name: repoName },
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    const repoFullName = response.data.full_name;
    const commands = viteReactCommands(repoFullName);
    for (const command of commands) {
      const { stdout, stderr } = await execPromise(command);
    }

    return NextResponse.json({
      message: `Repository ${repoFullName} created and project pushed successfully!`,
      url: response.data.html_url,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create and push project" },
      { status: 500 },
    );
  }
}
