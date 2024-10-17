import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export const runtime = "edge";
export async function POST(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const { error } = await supabase.from("subscribers").insert([{ email }]);
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({
          message: `Email ${email} is already registered`,
        });
      }
      throw error;
    }
    return NextResponse.json({
      message: `Email subscription successful for ${email}`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message, details: e.details },
      { status: e.status ?? 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const { error } = await supabase
      .from("subscribers")
      .delete()
      .eq("email", email);
    if (error) {
      throw error;
    }
    return NextResponse.json({
      message: `Email ${email} deleted successfully`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message, details: e.details },
      { status: e.status ?? 500 },
    );
  }
}
