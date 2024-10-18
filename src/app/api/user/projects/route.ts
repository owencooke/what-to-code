import { NextRequest, NextResponse } from "next/server";
import { getMyProjects } from "../db";
import { getUsername } from "@/lib/github/user";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")!;

  const user_id = await getUsername(authHeader);

  if (!user_id) {
    return NextResponse.json(
      { message: "Username is required" },
      { status: 400 },
    );
  }

  try {
    const projects = await getMyProjects(user_id);
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to fetch user projects",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
