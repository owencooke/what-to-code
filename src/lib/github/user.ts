import ky from "ky";

/**
 * Fetches the GitHub username associated with provided auth token.
 *
 * @param {string} authHeader - The authorization header containing the GitHub token.
 * @returns {Promise<string>} - A promise that resolves to the GitHub username.
 * @throws {Error} - Throws an error if the request fails.
 */
async function getUsername(authHeader: string): Promise<string> {
  if (!authHeader.startsWith("Bearer ")) {
    authHeader = `Bearer ${authHeader}`;
  }
  const user: any = await ky
    .get("https://api.github.com/user", {
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.github.v3+json",
      },
    })
    .json();
  return user.login;
}

export { getUsername };
