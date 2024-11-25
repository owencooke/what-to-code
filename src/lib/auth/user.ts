import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface AuthInfo {
  userId: string | null;
  accessToken: string;
  name: string | null;
  email: string | null;
}

/**
 * Wraps the getToken function and returns a more descriptive object.
 *
 * @param req - The incoming request object.
 * @returns  A promise that resolves to an object containing userId and accessToken.
 * @throws Throws an error if the token retrieval fails.
 */
export async function getAuthInfo(req: NextRequest): Promise<AuthInfo> {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie:
        process.env.NEXTAUTH_URL?.startsWith("https://") ??
        !!process.env.VERCEL_URL,
    });

    return {
      userId: token?.sub || null,
      accessToken: token?.accessToken as string,
      name: token?.name || null,
      email: token?.email || null,
    };
  } catch (error) {
    // Add more detailed logging
    console.error("Error retrieving token:", {
      error,
      headers: Object.fromEntries(req.headers),
      url: req.url,
    });

    // Instead of throwing, return null values for unauthenticated state
    return {
      userId: null,
      accessToken: "",
      name: null,
      email: null,
    };
  }
}
