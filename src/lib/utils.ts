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
 * @returns {Promise<AuthInfo | null>} - A promise that resolves to an object containing userId and accessToken, or null if the token is not found.
 * @throws {Error} - Throws an error if the token retrieval fails.
 */
export async function getAuthInfo(req: NextRequest): Promise<AuthInfo> {
  try {
    const token = await getToken({ req });

    return {
      userId: token?.sub || null,
      accessToken: token?.accessToken as string,
      name: token?.name || null,
      email: token?.email || null,
    };
  } catch (error) {
    console.error("Error retrieving token:", error);
    throw new Error("Failed to retrieve token");
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
