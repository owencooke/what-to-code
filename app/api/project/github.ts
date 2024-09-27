import { Feature, Framework } from "@/types/idea";
import { NewProject } from "@/types/project";
import axios from "axios";

const getRepoFromTitle = (title: string) =>
  title.toLowerCase().replace(/\s/g, "-");

async function matchTemplate(framework: Framework) {
  // TODO: Implement the logic to match the framework to a suitable GitHub template
  return {
    owner: "davidsaulrodriguez",
    repoName: "mern-stack-template",
  };
}

async function createRepoFromTemplate(project: NewProject, authHeader: string) {
  console.log("AUTH HEADER", authHeader);
  const template = await matchTemplate(project.framework);

  const url = `https://api.github.com/repos/${template.owner}/${template.repoName}/generate`;

  const body = {
    owner: project.github_user,
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
  repoOwner: string,
  feature: Feature,
  authHeader: string,
) {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/issues`;

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

export { createRepoFromTemplate, createIssue, getRepoFromTitle };
