"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Loader2 } from "lucide-react";
import CardScrollArea from "@/components/cards/CardScrollArea";
import { PartialIdea } from "@/types/idea";
import ky from "ky";
import FrameworkCard from "@/components/cards/FrameworkCard";

interface Framework {
  title: string;
  description: string;
  tools: string[];
}

export default function AIEngineer({ idea }: { idea: PartialIdea }) {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFrameworks = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const response = await ky.post(`/api/idea/expand/frameworks`, {
        json: idea,
      });
      if (!response.ok) {
        throw new Error("Failed to generate frameworks");
      }
      const data: Framework[] = await response.json();
      setFrameworks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-none shadow-lg">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">
            Software Architect
          </h2>
          <Code2 className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover optimal tech stacks for your project with AI-powered
          framework recommendations.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {frameworks.length > 0 ? (
          <CardScrollArea>
            {frameworks.map((framework, i) => (
              <FrameworkCard key={i} framework={framework} />
            ))}
          </CardScrollArea>
        ) : (
          <Button
            onClick={handleGenerateFrameworks}
            disabled={isGenerating}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Frameworks...
              </>
            ) : (
              <>
                <Code2 className="mr-2 h-4 w-4" />
                Generate AI-Powered Tech Stack Options
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
