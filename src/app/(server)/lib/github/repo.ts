import {
  extractDetailsFromRepoUrl,
  getRepoFromProjectTitle,
} from "@/app/(server)/lib/github/string-utils";
import { NewProject } from "@/types/project";
import ky from "ky";
import { GitHubRepo } from "@/types/github";

/**
 * Creates an empty GitHub repository.
 *
 * @param {NewProject} project - The project details.
 * @param {string} accessToken - The authorization header for GitHub API.
 * @returns {Promise<any>} - A promise that resolves to the created repository details.
 * @throws {Error} - Throws an error if the repository creation fails.
 */
async function createEmptyRepo(
  project: NewProject,
  accessToken: string,
): Promise<any> {
  return ky
    .post("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      json: {
        name: getRepoFromProjectTitle(project.title),
        description: project.description,
        private: false,
      },
    })
    .json();
}

/**
 * Creates a GitHub repository from a template.
 *
 * @param {NewProject} project - The project details.
 * @param {string} accessToken - The authorization header for GitHub API.
 * @returns {Promise<any>} - A promise that resolves to the created repository details.
 * @throws {Error} - Throws an error if the repository creation fails.
 */
async function createRepoFromTemplate(
  project: NewProject,
  accessToken: string,
): Promise<any> {
  if (!project.starterRepo) {
    return createEmptyRepo(project, accessToken);
  }
  const { owner, repoName } = extractDetailsFromRepoUrl(project.starterRepo);
  return ky
    .post(`https://api.github.com/repos/${owner}/${repoName}/generate`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.baptiste-preview+json",
      },
      json: {
        owner: project.github_user,
        name: getRepoFromProjectTitle(project.title),
        description: project.description,
        private: false,
      },
    })
    .json();
}

/**
 * Fetches GitHub repository details.
 *
 * @param {string} url - The URL of the GitHub repository.
 * @param {string} accessToken - The authorization header for GitHub API.
 * @returns {Promise<GitHubRepo>} - A promise that resolves to the GitHub repository details.
 * @throws {Error} - Throws an error if the fetch fails.
 */
async function getGitHubRepoDetails(
  url: string,
  accessToken: string,
): Promise<GitHubRepo> {
  const urlParts = new URL(url);
  const [owner, repoName] = urlParts.pathname.split("/").slice(1, 3);

  try {
    // Fetch repo details from GitHub API
    const repo: any = await ky
      .get(`https://api.github.com/repos/${owner}/${repoName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .json();

    // Return the GitHub repo info for matching template
    return {
      url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      topics: repo.topics,
      description: repo.description,
      name: repo.name,
    };
  } catch (error) {
    console.error(`Error fetching GitHub data for ${url}:`, error);
    throw new Error(`Failed to fetch GitHub data for ${url}`);
  }
}
export { createRepoFromTemplate, getGitHubRepoDetails };
