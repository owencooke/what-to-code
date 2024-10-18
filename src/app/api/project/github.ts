import { extractDetailsFromRepoUrl } from "@/lib/github/string-utils";
import { Feature } from "@/types/idea";
import { NewProject } from "@/types/project";
import ky from "ky";
import { GitHubRepo } from "@/types/github";

const getRepoFromTitle = (title: string) =>
  title.toLowerCase().replace(/\s/g, "-");

async function createEmptyRepo(
  project: NewProject,
  authHeader: string,
): Promise<GitHubRepo> {
  return ky
    .post(`https://api.github.com/user/repos`, {
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.github.v3+json",
      },
      json: {
        name: getRepoFromTitle(project.title),
        description: project.description,
        private: false,
      },
    })
    .json();
}

async function createRepoFromTemplate(project: NewProject, authHeader: string) {
  if (!project.starterRepo) {
    return createEmptyRepo(project, authHeader);
  }
  const { owner, repoName } = extractDetailsFromRepoUrl(project.starterRepo);
  return ky
    .post(`https://api.github.com/repos/${owner}/${repoName}/generate`, {
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.github.baptiste-preview+json",
      },
      json: {
        owner: project.github_user,
        name: getRepoFromTitle(project.title),
        description: project.description,
        private: false,
      },
    })
    .json();
}

const composeIssueMarkdown = (feature: Feature) => {
  const [_, userRole, action, goal] = feature.userStory
    .split(/As an?|I want|so that/)
    .map((str) => str.trim().replace(/^[^\w\s]+|[^\w\s]+$/g, ""));
  const article = userRole.charAt(0).match(/[aeiou]/i) ? "an" : "a";
  return `
# ${feature.title}

## User Story

_**As ${article}** ${userRole}, **I want** ${action} **so that** ${goal}._

## Acceptance Criteria

${feature.acceptanceCriteria
  .map((criterion) => `- [ ] ${criterion}`)
  .join("\n")}
`;
};

async function createIssue(
  repoName: string,
  repoOwner: string,
  feature: Feature,
  authHeader: string,
) {
  return ky
    .post(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.github.v3+json",
      },
      json: {
        title: `[STORY] ${feature.title}`,
        body: composeIssueMarkdown(feature),
        labels: ["enhancement"],
      },
    })
    .json();
}

export { createRepoFromTemplate, createIssue, getRepoFromTitle };
