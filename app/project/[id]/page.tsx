"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FeatureCard from "@/components/cards/FeatureCard";
import FrameworkCard from "@/components/cards/FrameworkCard";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import RepoDisplay from "@/components/github/Repo";
import { getRepoFromTitle } from "../../api/project/github";
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [project, setProject] = useState<Project>();

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
            <h1 className="text-5xl my-4">{project.title}</h1>
            <h4>{project.description}</h4>
            {/* FIXME: repo display needs to display user from project, not necessarily current active user */}
            <RepoDisplay
              className="pt-4"
              name={getRepoFromTitle(project.title)}
              isClickable
            />
          </CardHeader>
        </Card>
        <Card className="w-full h-full lg:w-3/5">
          <CardHeader className="gap-4 p-4">
            <h2 className="text-xl">Features</h2>
            <ScrollArea>
              <div className="flex gap-4">
                {project.features?.map((feature, i) => (
                  <FeatureCard key={i} feature={feature} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <h2 className="text-xl mt-4">Type of Project</h2>
            <FrameworkCard framework={project.framework} />
          </CardHeader>
        </Card>
      </div>
    )
  );
}
