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
import { useEffect, useMemo } from "react";
import { ProjectSchema } from "@/types/project";

export default function Home() {
  const router = useRouter();

  const project = useMemo(() => {
    const storedProject = sessionStorage.getItem("project");
    if (storedProject) {
      try {
        return ProjectSchema.safeParse(JSON.parse(storedProject)).data;
      } catch (error) {}
    }
    return null;
  }, []);

  // Redirect back to landing page, if no valid project
  useEffect(() => {
    if (!project) {
      router.push("/");
    }
  }, [project, router]);

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
