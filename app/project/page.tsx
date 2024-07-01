"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="flex gap-8 m-8">
        <Card className="w-2/5">
          <CardHeader>
            <h1 className="text-6xl mt-16">{project.title}</h1>
            <p>{project.description}</p>
            <RepoDisplay
              className="pt-4"
              name={getRepoFromTitle(project.title)}
              isClickable
            />
          </CardHeader>
        </Card>
        <Card className="w-3/5">
          <CardHeader className="gap-4 p-4">
            <h2 className="text-2xl">Features</h2>
            <ScrollArea>
              <div className="flex gap-4">
                {project.features?.map((feature, i) => (
                  <FeatureCard key={i} feature={feature} className="scale-90" />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <h2 className="text-2xl mt-8">Project Type</h2>
            <FrameworkCard framework={project.framework} className="scale-90" />
          </CardHeader>
        </Card>
      </div>
    )
  );
}
