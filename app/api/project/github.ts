import { Feature, Framework } from "@/types/idea";
import { Project } from "@/types/project";
import axios from "axios";

const composeIssueMarkdown = (feature: Feature) => `
## Feature: ${feature.title}

### User Story

As a **${feature.userStory.split(" ")[2]}**, I want **${
  feature.userStory.split(" ")[5]
}** so that **${feature.userStory.split(" ")[8]}**.

### Acceptance Criteria

${feature.acceptanceCriteria
  .map((criterion) => `- [ ] ${criterion}`)
  .join("\n")}

### Additional Information

_Provide any additional information or context about the feature here._
`;

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

async function createIssue(
  repoName: string,
  feature: Feature,
  authHeader: string,
) {
  const REPO_OWNER = await getUsername(authHeader);

  const url = `https://api.github.com/repos/${REPO_OWNER}/${repoName}/issues`;

  const body = {
    title: `FEAT: ${feature.title}`,
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

export { createRepoFromTemplate, createIssue };
