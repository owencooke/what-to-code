import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export const runtime = "edge";
export async function POST(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const { error } = await supabase.from("subscribers").insert([{ email }]);
    if (error) {
      console.log(error);
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
