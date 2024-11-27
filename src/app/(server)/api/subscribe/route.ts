import { NextRequest, NextResponse } from "next/server";
import { resend, audienceId } from "@/app/(server)/integration/email/config";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName } = await req.json();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Create contact in Resend
    const response = await resend.contacts.create({
      audienceId,
      email,
      firstName,
      lastName,
      unsubscribed: false,
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Successfully subscribed",
        data: response,
      },
      { status: 200 },
    );
  } catch (error: any) {
    // Handle specific Resend errors
    if (error.statusCode === 409) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 409 },
      );
    }

    // Handle other errors
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
