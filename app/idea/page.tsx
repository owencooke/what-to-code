"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useState } from "react";

const defaultIdea = {
  title: "Virtual Fitness Trainer",
  description:
    "An AI-powered virtual fitness trainer that creates personalized workout plans and provides real-time feedback and motivation to users.",
  features: [
    {
      title: "Virtual Workout Partner Matching",
      description:
        "Match users with similar fitness goals and schedules to workout together virtually.",
    },
    {
      title: "Progress Tracking",
      description:
        "Allow users to track and compare their workout progress, achievements, and goals.",
    },
    {
      title: "Motivational Messaging",
      description:
        "Send motivational messages and reminders to users to keep them engaged and motivated in their fitness journey.",
    },
  ],
};

export default function Home() {
  const [idea, setIdea] = useState(defaultIdea);

  const handleNewIdea = async () => {
    const response = await fetch("/api/idea");
    setIdea(await response.json());
  };

  console.log(idea);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
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
            <h1>Major Features</h1>
            <ol>
              {idea.features.map((feature, i) => (
                <li key={`feature-${i}`}>
                  {feature.title}
                  <ul>
                    <li>{feature.description}</li>
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
