"use client";

import { Card, CardHeader } from "@/components/ui/card";
import FeatureCard from "@/components/cards/FeatureCard";
import { useEffect, useState } from "react";
import { NewProject } from "@/types/project";
import RepoDisplay from "@/components/github/Repo";
import { getRepoFromTitle } from "../../api/project/github";
import { useRouter } from "next/navigation";
import CardScrollArea from "@/components/cards/CardScrollArea";
import { Badge } from "@/components/ui/badge";

export default function Home({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [project, setProject] = useState<NewProject>();

  useEffect(() => {
    const redirect = () => router.push("/");
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/project/${id}`);
        if (!response.ok) {
          redirect();
          return;
        }
        const projectData = await response.json();
        setProject(projectData);
      } catch (error) {
        redirect();
      }
    };
    fetchProject();
  }, [id, router]);

  return (
    project && (
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="w-full lg:w-2/5">
          <CardHeader>
            <h1 className="text-3xl md:text-4xl my-4">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
            <RepoDisplay
              className="pt-4"
              repoName={getRepoFromTitle(project.title)}
              username={project.github_user}
              isClickable
            />
          </CardHeader>
        </Card>
        <Card className="w-full h-full lg:w-3/5">
          <CardHeader className="p-4">
            <h2 className="text-xl mt-4">{project.framework.title}</h2>
            <div className="flex flex-wrap gap-2">
              {project.framework.tools.map((tech, idx) => (
                <Badge key={idx} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
            <h2 className="text-xl !mt-8">Features</h2>
            <CardScrollArea>
              {project.features?.map((feature, i) => (
                <FeatureCard key={i} feature={feature} />
              ))}
            </CardScrollArea>
          </CardHeader>
        </Card>
      </div>
    )
  );
}
