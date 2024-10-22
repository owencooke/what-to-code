import { NextRequest, NextResponse } from "next/server";
import { getProjectsByUserId } from "@/lib/db/query/project";
import { getAuthInfo } from "@/lib/utils";

// FIXME: this should probably be refactored to work for any userID, not just the logged in user
export async function GET(req: NextRequest) {
  const { userId } = await getAuthInfo(req);

  if (!userId) {
    return NextResponse.json(
      { message: "User not logged in." },
      { status: 401 },
    );
  }

  try {
    const projects = await getProjectsByUserId(userId);
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
