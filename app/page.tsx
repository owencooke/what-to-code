"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });

  const getProjectIdea = async () => {
    try {
      const response = await fetch("/api/idea", { method: "GET" });
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1>what to code</h1>
      <Button onClick={getProjectIdea} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get project idea"}
      </Button>
      {project.title && (
        <>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </>
      )}
    </>
  );
}
