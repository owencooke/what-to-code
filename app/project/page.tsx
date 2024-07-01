"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FeatureCard from "@/components/cards/FeatureCard";
import FrameworkCard from "@/components/cards/FrameworkCard";
import { useEffect, useState } from "react";
import { Project, ProjectSchema } from "@/types/project";

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
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-7xl mt-16">{project.title}</h1>
        <Card className="mt-8 w-4/5">
          <CardHeader className="gap-4">
            <CardTitle></CardTitle>
            <CardDescription>{project.description}</CardDescription>
            <ScrollArea>
              <div className="flex">
                {project.features?.map((feature, i) => (
                  <FeatureCard key={i} feature={feature} className="scale-90" />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <FrameworkCard framework={project.framework} className="scale-90" />
          </CardHeader>
        </Card>
      </div>
    )
  );
}
