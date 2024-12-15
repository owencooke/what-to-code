import { getProjectById } from "@/app/(server)/db/query/project";
import { getGitHubRepoDetails } from "@/app/(server)/integration/github/repo";
import ProjectTitleWidget from "./TitleWidget";
import GitHubWidget from "./GitHubWidget";
import ToolsWidget from "./ToolsWidget";
import FeaturesWidget from "./FeaturesWidget";
import { redirect } from "next/navigation";
import { getUrlFromOwnerAndTitle } from "@/app/(server)/integration/github/string-utils";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/(server)/api/auth/[...nextauth]/route";

export default async function Page({ params }: { params: { id: string } }) {
  // Get project details
  const project = await getProjectById(params.id);
  if (!project) {
    return redirect("/404");
  }

  // Get GitHub repo info
  const session = await getServerSession(nextAuthOptions);
  const repoUrl = getUrlFromOwnerAndTitle(project.github_user, project.title);
  let repoInfo = null;
  try {
    repoInfo = await getGitHubRepoDetails(
      repoUrl,
      session?.user.accessToken as string,
    );
  } catch (error) {
    console.error("Failed to fetch GitHub repo info", error);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="md:col-span-2">
        <ProjectTitleWidget project={project} />
      </div>
      <div>
        <GitHubWidget repoInfo={repoInfo} />
      </div>
      <div>
        <ToolsWidget framework={project.framework} />
      </div>
      <div className="md:col-span-2">
        <FeaturesWidget features={project.features} />
      </div>
    </div>
  );
}
