"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/app/(client)/components/ui/card";
import { Button } from "@/app/(client)/components/ui/button";
import { ScrollText, Loader2, Sparkles } from "lucide-react";
import { PartialIdea } from "@/types/idea";
import { Feature } from "@/types/project";
import CardScrollArea from "@/app/(client)/components/cards/CardScrollArea";
import FeatureCard from "@/app/(client)/components/cards/FeatureCard";
import ky from "ky";
import { useCreateProjectStore } from "@/app/(client)/stores/useCreateProjectStore";

export default function AIProductManager({ idea }: { idea: PartialIdea }) {
  const { features, setFeatures } = useCreateProjectStore();
  const [isExpanding, setIsExpanding] = useState(false);

  const handleExpandFeatures = async () => {
    if (isExpanding) return;
    setIsExpanding(true);
    try {
      const response = await ky.post(`/api/idea/expand/features`, {
        json: idea,
      });
      if (!response.ok) {
        throw new Error("Failed to expand features");
      }
      const data: Feature[] = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-none shadow-lg">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between text-purple-700 dark:text-purple-300">
          <h2 className="text-3xl font-bold">Product Manager</h2>
          <ScrollText className="w-8 h-8" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Transform your initial ideas into a comprehensive product vision with
          AI-powered user stories.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {features.length > 0 ? (
          <CardScrollArea>
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} />
            ))}
          </CardScrollArea>
        ) : (
          <Button
            onClick={handleExpandFeatures}
            disabled={isExpanding}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isExpanding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Expanding Features...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Detailed Features
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
