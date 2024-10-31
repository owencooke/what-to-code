"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import type { PartialIdea } from "@/types/idea";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/components/cards/IdeaCard";

export default function IdeasGrid({ ideas }: { ideas: PartialIdea[] }) {
  const router = useRouter();
  const [selectedIdea, setSelectedIdea] = useState<PartialIdea | null>(null);

  const openIdeaDetails = (idea: PartialIdea) => {
    setSelectedIdea(idea);
  };

  const closeIdeaDetails = () => {
    setSelectedIdea(null);
  };

  const handleTryIdea = () => {
    if (selectedIdea) {
      router.push(`/idea/expand/${selectedIdea.id}`);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ideas.map((idea) => (
          <Card
            key={idea.id}
            className="cursor-pointer transition-colors hover:bg-border"
            onClick={() => openIdeaDetails(idea)}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {idea.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {idea.description}
              </p>
              {idea.features && idea.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Features:</h4>
                  <ul className="text-xs text-muted-foreground list-disc list-inside">
                    {idea.features
                      .slice(0, 3)
                      .map((feature: { title: string }, idx: number) => (
                        <li key={idx} className="line-clamp-1">
                          {feature.title}
                        </li>
                      ))}
                  </ul>
                  {idea.features.length > 3 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      + {idea.features.length - 3} more
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {selectedIdea && (
          <Dialog open={!!selectedIdea} onOpenChange={closeIdeaDetails}>
            <DialogContent className="max-w-[350px] md:max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <IdeaCard idea={selectedIdea} showInterestButton bare />
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
