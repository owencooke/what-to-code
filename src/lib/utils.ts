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
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<AuthInfo>} - A promise that resolves to an object containing userId and accessToken.
 * @throws {Error} - Throws an error if the token retrieval fails.
 */
export async function getAuthInfo(req: NextRequest): Promise<AuthInfo> {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      // Tell NextAuth we're in an Edge runtime
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

export const selectRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const toAlphaLowerCase = (str: string): string =>
  str.replace(/[^a-zA-Z]/g, "").toLowerCase();

export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
};
