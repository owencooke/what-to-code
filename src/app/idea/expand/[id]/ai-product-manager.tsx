"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { Feature } from "@/types/idea";
import CardScrollArea from "@/components/cards/CardScrollArea";
import FeatureCard from "@/components/cards/FeatureCard";

export default function AIProductManager({
  initialFeatures,
  ideaId,
}: {
  initialFeatures: Feature[];
  ideaId: number;
}) {
  const [expandedFeatures, setExpandedFeatures] = useState<Feature[]>([]);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleExpandFeatures = async () => {
    if (isExpanding) return;
    setIsExpanding(true);
    try {
      const response = await fetch(`/api/idea/expand/features?id=${ideaId}`);
      if (!response.ok) {
        throw new Error("Failed to expand features");
      }
      const data = await response.json();
      setExpandedFeatures(data.features);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-none shadow-lg">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300">
            AI Product Manager
          </h2>
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Transform your initial ideas into a comprehensive product vision with
          our AI-powered feature expansion.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <CardScrollArea>
          {expandedFeatures.length > 0
            ? expandedFeatures.map((feature, i) => (
                <FeatureCard key={i} feature={feature} />
              ))
            : initialFeatures.map((feature, i) => (
                <Card key={i} className="p-4 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-300">
                    {feature.title}
                  </h3>
                </Card>
              ))}
        </CardScrollArea>
        {expandedFeatures.length === 0 && (
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
                Unleash AI-Powered Feature Expansion
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
