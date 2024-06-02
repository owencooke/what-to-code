"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import defaultIdea from "@/app/idea/demo";

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
                  <ul className="font-normal">
                    <li>{framework.description}</li>
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
