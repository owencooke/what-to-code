"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Loader2 } from "lucide-react";
import CardScrollArea from "@/components/cards/CardScrollArea";

interface Framework {
  title: string;
  description: string;
  tools: string[];
}

export default function AIEngineer({ ideaId }: { ideaId: number }) {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFrameworks = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/idea/expand/frameworks?id=${ideaId}`);
      if (!response.ok) {
        throw new Error("Failed to generate frameworks");
      }
      const data = await response.json();
      setFrameworks(data.frameworks);
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
            AI Engineer
          </h2>
          <Code2 className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover optimal tech stacks for your project with our AI-powered
          framework recommendations.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <CardScrollArea>
          {frameworks.map((framework, i) => (
            <Card key={i} className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-300">
                {framework.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {framework.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {framework.tools.map((tool, j) => (
                  <span
                    key={j}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </CardScrollArea>
        {frameworks.length === 0 && (
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
                Generate AI-Powered Framework Options
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
