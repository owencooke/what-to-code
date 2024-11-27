"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { PartialIdea } from "@/types/idea";
import { IdeaCard } from "@/components/cards/IdeaCard";

export default function Component({ ideas }: { ideas: PartialIdea[] }) {
  const [selectedIdea, setSelectedIdea] = useState<PartialIdea | null>(null);

  const openIdeaDetails = (idea: PartialIdea) => {
    setSelectedIdea(idea);
  };

  const closeIdeaDetails = () => {
    setSelectedIdea(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <Card
            key={idea.id}
            className="cursor-pointer transition-all hover:bg-accent hover:shadow-md"
            onClick={() => openIdeaDetails(idea)}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3 line-clamp-2">
                {idea.title}
              </h3>
              {idea.features && idea.features.length > 0 && (
                <div className="space-y-2">
                  {idea.features
                    .slice(0, 3)
                    .map((feature: { title: string }, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <ChevronRight className="w-4 h-4 mr-2 text-primary" />
                        <span className="flex-1">{feature.title}</span>
                      </div>
                    ))}
                  {idea.features.length > 3 && (
                    <div className="flex items-center text-sm text-primary font-medium">
                      <ChevronRight className="w-4 h-4 mr-1" />
                      <span>+{idea.features.length - 3} more</span>
                    </div>
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
