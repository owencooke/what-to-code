import ky from "ky";

/**
 * Fetches the GitHub username associated with provided auth token.
 *
 * @param {string} accessToken - The authorization header containing the GitHub token.
 * @returns {Promise<any>} - A promise that resolves to the GitHub user info.
 * @throws {Error} - Throws an error if the request fails.
 */
async function getUser(accessToken: string): Promise<any> {
  const user: any = await ky
    .get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    .json();
  return user;
}

export { getUser };
