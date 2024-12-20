import { Feature } from "@/types/project";
import ky from "ky";

const formatFeatureIssueMarkdown = (feature: Feature) => {
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
  accessToken: string,
) {
  return ky
    .post(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      json: {
        title: `[STORY] ${feature.title}`,
        body: formatFeatureIssueMarkdown(feature),
        labels: ["enhancement"],
      },
    })
    .json();
}

export { createIssue };
