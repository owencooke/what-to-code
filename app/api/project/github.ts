import { Feature, Framework } from "@/types/idea";
import { Project } from "@/types/project";
import axios from "axios";

const getRepoFromTitle = (title: string) =>
  title.toLowerCase().replace(/\s/g, "-");

async function getUsername(authHeader: string) {
  const url = "https://api.github.com/user";
  const response = await axios.get(url, {
    headers: {
      Authorization: authHeader,
      Accept: "application/vnd.github.v3+json",
    },
  });
  return response.data.login;
}

async function matchTemplate(framework: Framework) {
  // TODO: Implement the logic to match the framework to a suitable GitHub template
  return {
    owner: "davidsaulrodriguez",
    repoName: "mern-stack-template",
  };
}

async function createRepoFromTemplate(project: Project, authHeader: string) {
  console.log("AUTH HEADER", authHeader);
  const template = await matchTemplate(project.framework);

  const url = `https://api.github.com/repos/${template.owner}/${template.repoName}/generate`;

  const body = {
    owner: await getUsername(authHeader),
    name: getRepoFromTitle(project.title),
    description: project.description,
    private: false,
  };

  const response = await axios.post(url, body, {
    headers: {
      Authorization: authHeader,
      Accept: "application/vnd.github.baptiste-preview+json",
    },
  });
  return response.data;
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
  feature: Feature,
  authHeader: string,
) {
  const REPO_OWNER = await getUsername(authHeader);

  const url = `https://api.github.com/repos/${REPO_OWNER}/${repoName}/issues`;

  const body = {
    title: `[STORY] ${feature.title}`,
    body: composeIssueMarkdown(feature),
    labels: ["enhancement"],
  };

  const response = await axios.post(url, body, {
    headers: {
      Authorization: authHeader,
      Accept: "application/vnd.github.v3+json",
    },
  });
  return response.data;
}

export { createRepoFromTemplate, createIssue, getRepoFromTitle, getUsername };
