"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PartialIdea } from "@/types/idea";
import AIProductManager from "./ai-product-manager";
import AIEngineer from "./ai-engineer";

interface ExpandIdeaProps {
  idea: PartialIdea;
}

export default function ExpandIdea({ idea }: ExpandIdeaProps) {
  const router = useRouter();

  const handleCreateProject = () => {
    localStorage.setItem("idea", JSON.stringify(idea));
    router.push("/project/create");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8 lg:gap-12 mt-4">
      <h1 className="text-4xl font-bold">{idea.title}</h1>
      <p className="text-xl">{idea.description}</p>
      <AIProductManager idea={idea} />
      <AIEngineer idea={idea} />
      <Button
        size="lg"
        onClick={handleCreateProject}
        className="w-full py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        help me start this project
      </Button>
    </div>
  );
}
