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
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import type { PartialIdea } from "@/types/idea";

export default function IdeasGrid({ ideas }: { ideas: PartialIdea[] }) {
  const [selectedIdea, setSelectedIdea] = useState<PartialIdea | null>(null);

  const openIdeaDetails = (idea: PartialIdea) => {
    setSelectedIdea(idea);
  };

  const closeIdeaDetails = () => {
    setSelectedIdea(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ideas.map((idea) => (
          <Card
            key={idea.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openIdeaDetails(idea)}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-2">
                {idea.title}
              </h3>
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
                <DialogHeader>
                  <DialogTitle>{selectedIdea.title}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="mt-4 max-h-[60vh]">
                  <DialogDescription className="text-muted-foreground text-sm">
                    {selectedIdea.description}
                  </DialogDescription>
                </ScrollArea>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
