import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import axios from "axios";
import os from "os";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { repoName, accessToken } = await req.json();

    if (!repoName || !accessToken) {
      return NextResponse.json(
        { message: "Repository name and access token are required" },
        { status: 400 },
      );
    }

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

    const commands = [
      `npm create vite@latest my-vite-app -- --template react`,
      `cd my-vite-app && git init`,
      `cd my-vite-app && git remote add origin https://github.com/${repoFullName}.git`,
      `cd my-vite-app && git add .`,
      `cd my-vite-app && git commit -m "Initial commit"`,
      `cd my-vite-app && git branch -M main`,
      `cd my-vite-app && git push -u origin main`,
      os.platform() === "win32" ? `rd /s /q my-vite-app` : `rm -rf my-vite-app`, // kinda sketchy
    ];

    for (const command of commands) {
      const { stdout, stderr } = await execPromise(command);
      console.log(`Executed: ${command}\nstdout: ${stdout}\nstderr: ${stderr}`);
    }

    return NextResponse.json({
      message: `Repository ${repoFullName} created and project pushed successfully!`,
    });
  } catch (error: any) {
    console.error("Error creating repository:", error);
    return NextResponse.json(
      { message: "Failed to create and push project", error: error.message },
      { status: 500 },
    );
  }
}
