"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Project } from "@/types/project";
import { useSession } from "next-auth/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FeatureCard from "@/components/cards/FeatureCard";
import FrameworkCard from "@/components/cards/FrameworkCard";
import RepoDisplay from "@/components/github/Repo";
import { getRepoFromTitle } from "../api/project/github";

export default function Home() {
  const { data: session } = useSession();

  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const redirect = () => router.push("/");
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/user/feed`, {
          method: "GET",
          headers: {
            Authorization: "token " + session?.accessToken,
          },
        });
        if (!response.ok) {
          redirect();
          return;
        }
        const projectData = await response.json();
        setProjects(projectData);
      } catch (error) {
        redirect();
      }
    };
    if (session?.accessToken) {
      fetchProject();
    }
  }, [session?.accessToken, router]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-7xl mt-12 mb-6">hmm, what to code?</h1>
      <div className="m-8 w-4/5">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              className="flex flex-col lg:flex-row gap-8"
              key={project.description}
            >
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
          ))
        ) : (
          <Card className="mt-8 w-4/5">
            <CardHeader className="gap-8">
              <>No projects found</>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
