"use client";

import { Idea } from "@/app/api/idea/logic";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useState } from "react";

const defaultIdea: Idea = {
  title: "Virtual Fitness Trainer",
  description:
    "An AI-powered virtual fitness trainer that creates personalized workout plans and provides real-time feedback and motivation to users.",
};

export default function Home() {
  const [idea, setIdea] = useState(defaultIdea);

  const handleNewIdea = async () => {
    const response = await fetch("/api/idea");
    setIdea(await response.json());
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-7xl">hmm, what to code?</h1>
        <Button onClick={handleNewIdea}>generate new</Button>
      </div>
      <Card className="mt-16">
        <CardHeader>
          <h1>{idea.title}</h1>
          <p>{idea.description}</p>
        </CardHeader>
      </Card>
    </div>
  );
}
