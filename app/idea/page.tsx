"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import defaultIdea from "@/app/idea/data/demo";
import { Badge } from "@/components/ui/badge";
import tools from "./data/tools";
import { IdeaForm } from "./form";
import { ButtonWithLoading, buttonVariants } from "@/components/ui/button";
import { toAlphaLowerCase } from "@/lib/utils";
import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Home() {
  const [idea, setIdea] = useState(defaultIdea);

  const expandIdea = async () => {
    const response = await fetch(`/api/idea`, {
      method: "POST",
      body: JSON.stringify({
        title: idea.title,
        description: idea.description,
      }),
    });
    if (!response.ok) {
      console.error("Failed to expand on idea:", response.statusText);
      return;
    }
    const data = await response.json();
    setIdea({ ...idea, ...data });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-7xl">hmm, what to code?</h1>
        <div className="flex gap-8">
          <IdeaForm onSubmit={setIdea} />
        </div>
      </div>
      <Card className="mt-16 w-4/5">
        <CardHeader className="gap-8">
          <div>
            <h1>{idea.title}</h1>
            <p>{idea.description}</p>
          </div>
          {!idea.features ? (
            <div className="flex justify-center">
              <ButtonWithLoading
                onClick={expandIdea}
                loadingText="expanding your idea..."
              >
                {"i'm interested"}
              </ButtonWithLoading>
            </div>
          ) : (
            <>
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
                <ol>
                  {idea.frameworks?.map((framework, i) => (
                    <li key={`framework-${i}`} className="font-bold">
                      {framework.title}
                      <ul className="font-normal">
                        <li>
                          {framework.description.split(" ").map((word, j) => {
                            const tool = framework.tools.find(
                              (tool) =>
                                toAlphaLowerCase(tool) ===
                                toAlphaLowerCase(word),
                            );
                            if (tool && tools.includes(tool)) {
                              const punctuation =
                                word.match(/[^a-zA-Z0-9]+$/)?.[0] || "";
                              return (
                                <span key={`tool-${i}-${j}`}>
                                  <Badge
                                    variant="secondary"
                                    className="ml-px mr-1"
                                  >
                                    {punctuation
                                      ? word.slice(0, -punctuation.length)
                                      : word}
                                    <i
                                      className={`ml-2 devicon-${tool}-original ml-2 devicon-${tool}-plain colored`}
                                    ></i>
                                  </Badge>
                                  {punctuation && punctuation + " "}
                                </span>
                              );
                            }
                            return word + " ";
                          })}
                        </li>
                      </ul>
                    </li>
                  ))}
                </ol>
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
            </>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}
