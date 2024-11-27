"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IdeaForm } from "./form";
import { NewIdea, Idea } from "@/types/idea";
import {
  EmptyIdeaCard,
  IdeaCard,
  IdeaSkeletonCard,
} from "@/app/(client)/components/cards/IdeaCard";

export default function IdeaPage() {
  const [idea, setIdea] = useState<Idea | NewIdea>();
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);

  return (
    <motion.div
      className="flex flex-col lg:flex-row justify-center items-center h-full gap-12 lg:gap-24 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center justify-start w-full"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1
          className="text-5xl lg:text-6xl mb-6 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          hmm, what to code?
        </motion.h1>
        <IdeaForm
          onClick={() => {
            setIsIdeaLoading(true);
          }}
          onSubmit={(idea) => {
            setIdea(idea);
            setIsIdeaLoading(false);
          }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full flex justify-center"
      >
        {isIdeaLoading ? (
          <IdeaSkeletonCard />
        ) : idea ? (
          <IdeaCard idea={idea} showInterestButton></IdeaCard>
        ) : (
          <EmptyIdeaCard />
        )}
      </motion.div>
    </motion.div>
  );
}
