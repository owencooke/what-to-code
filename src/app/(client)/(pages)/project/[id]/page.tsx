import { getProjectById } from "@/app/(server)/db/query/project";
import { getGitHubRepoDetails } from "@/app/(server)/integration/github/repo";
import ProjectTitleWidget from "./TitleWidget";
import GitHubWidget from "./GitHubWidget";
import ToolsWidget from "./ToolsWidget";
import FeaturesWidget from "./FeaturesWidget";
import { redirect } from "next/navigation";
import { getUrlFromOwnerAndTitle } from "@/app/(server)/integration/github/string-utils";

export default async function Page({ params }: { params: { id: string } }) {
  // Get project details
  const project = await getProjectById(params.id);
  if (!project) {
    return redirect("/404");
  }

  // Get GitHub repo info
  const repoUrl = getUrlFromOwnerAndTitle(project.github_user, project.title);
  const repoInfo = await getGitHubRepoDetails(repoUrl).catch(() => null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      <div className="md:col-span-2 xl:col-span-3">
        <ProjectTitleWidget project={project} />
      </div>
      <div className="md:col-span-2 xl:col-span-1">
        <GitHubWidget repoInfo={repoInfo} />
      </div>
      <div>
        <ToolsWidget framework={project.framework} />
      </div>
      <div className="md:col-span-3">
        <FeaturesWidget features={project.features} />
      </div>
    </div>
  );
}
