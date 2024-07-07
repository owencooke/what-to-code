import { NextRequest, NextResponse } from "next/server";
import { getProject } from "../db";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  console.log("server", id);

  if (!id) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 },
    );
  }

  try {
    const project = await getProject(id);
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to fetch project",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
