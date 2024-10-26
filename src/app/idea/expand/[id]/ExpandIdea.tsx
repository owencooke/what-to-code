"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PartialIdea } from "@/types/idea";
import AIProductManager from "./ai-product-manager";
import AIEngineer from "./ai-engineer";

export default function IdeaClient({ idea }: { idea: PartialIdea }) {
  const router = useRouter();

  const handleCreateProject = () => {
    localStorage.setItem("idea", JSON.stringify(idea));
    router.push("/project/create");
  };

  return (
    <div className="flex flex-col justify-center items-center h-full gap-12 lg:gap-24 mt-4">
      <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none shadow-lg">
        <CardHeader className="gap-8">
          <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300">
            {idea.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {idea.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AIProductManager
              initialFeatures={idea.features || []}
              ideaId={idea.id}
            />
            <AIEngineer ideaId={idea.id} />
          </div>
          <Button
            size="lg"
            onClick={handleCreateProject}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Launch Your Project Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
