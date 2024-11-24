import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "@/lib/db/query/project";

export const runtime = "edge";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 },
    );
  }

  try {
    const project = await getProjectById(id);
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
