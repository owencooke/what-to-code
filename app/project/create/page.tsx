"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Idea } from "@/app/idea/types";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FeatureCard from "@/components/FeatureCard";
import FrameworkCard from "@/components/FrameworkCard";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Redirect back to generate idea page if no valid idea
  let idea: Idea | undefined;
  try {
    idea = JSON.parse(searchParams.get("idea") || "");
  } catch (error) {
    router.push("/idea");
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-7xl mt-16">kickstart your project</h1>
      {idea && (
        <Card className="mt-16 w-4/5">
          <CardHeader className="gap-8">
            <div>
              <h1>{idea.title}</h1>
              <p>{idea.description}</p>
            </div>

            <div>
              <h1>what to make</h1>
              <ScrollArea className="mt-8">
                <div className="flex gap-12">
                  {idea.features?.map((feature, i) => (
                    <FeatureCard key={i} feature={feature} />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <div>
              <h1>how to build it</h1>
              <ScrollArea className="mt-8">
                <div className="flex gap-12">
                  {idea.frameworks?.map((framework, i) => (
                    <FrameworkCard key={i} framework={framework} />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            {/* TODO: link to "Create Project" page here */}
            <Link
              className={buttonVariants({ variant: "default", size: "lg" })}
              href={`/project/create?idea=${encodeURIComponent(
                JSON.stringify(idea),
              )}`}
            >
              create project
            </Link>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
