"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import defaultIdea from "@/app/idea/demo";
import { Badge } from "@/components/ui/badge";
import tools from "./tools";

const toAlphaLowerCase = (str: string) =>
  str.replace(/[^a-zA-Z]/g, "").toLowerCase();

export default function Home() {
  const [idea, setIdea] = useState(defaultIdea);

  const handleNewIdea = async () => {
    const response = await fetch("/api/idea");
    setIdea(await response.json());
  };

  console.log(idea);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-7xl">hmm, what to code?</h1>
        <Button onClick={handleNewIdea}>generate new</Button>
      </div>
      <Card className="mt-16">
        <CardHeader className="gap-8">
          <div>
            <h1>{idea.title}</h1>
            <p>{idea.description}</p>
          </div>
          <div>
            <h1>what to make</h1>
            <ol>
              {idea.features.map((feature, i) => (
                <li key={`feature-${i}`} className="font-bold">
                  {feature.title}
                  <ul className="font-normal">
                    <li>{feature.description}</li>
                    <li>{feature.story}</li>
                  </ul>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h1>how to build it</h1>
            <ol>
              {idea.frameworks.map((framework, i) => (
                <li key={`framework-${i}`} className="font-bold">
                  {framework.title}
                  {/* DISPLAYS ALL LOGOS NEXT TO FRAMEWORK IN TEXT
                    TODOS:
                        - make badges clickable and open resources?
                  */}
                  <ul className="font-normal">
                    <li>
                      {framework.description.split(" ").map((word, index) => {
                        const tool = framework.tools.find(
                          (tool) =>
                            toAlphaLowerCase(tool) === toAlphaLowerCase(word),
                        );
                        if (tool && tools.includes(tool)) {
                          const punctuation =
                            word.match(/[^a-zA-Z0-9]+$/)?.[0] || "";
                          return (
                            <>
                              <Badge
                                key={index}
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
                            </>
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
        </CardHeader>
      </Card>
    </div>
  );
}
