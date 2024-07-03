"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FeatureCard from "@/components/cards/FeatureCard";
import FrameworkCard from "@/components/cards/FrameworkCard";
import { useEffect, useState } from "react";
import { Project, ProjectSchema } from "@/types/project";
import RepoDisplay from "@/components/github/Repo";
import { getRepoFromTitle } from "../api/project/github";

export default function Home() {
  const router = useRouter();
  const [project, setProject] = useState<Project>();

  // Redirect back to landing page, if no valid project in sessionStorage
  // TODO: fetch from project DB instead of storage, based on route ID
  useEffect(() => {
    const redirect = () => router.push("/");
    try {
      const parsedProject = ProjectSchema.safeParse(
        JSON.parse(sessionStorage.getItem("project") || ""),
      );
      setProject(parsedProject.data);
      if (!parsedProject.success) {
        redirect();
      }
    } catch (error) {
      redirect();
    }
  }, [router]);

  return (
    project && (
      <div className="flex flex-col lg:flex-row gap-8 m-6">
        <Card className="w-full lg:w-2/5">
          <CardHeader>
            <h1 className="text-5xl my-4">{project.title}</h1>
            <h4>{project.description}</h4>
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
