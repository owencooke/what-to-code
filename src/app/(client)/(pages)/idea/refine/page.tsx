"use client";

import { motion } from "framer-motion";
import {
  EmptyIdeaCard,
  IdeaCard,
  IdeaSkeletonCard,
} from "@/app/(client)/components/cards/IdeaCard";
import { IdeaRefinement } from "../refine/IdeaRefinement";
import { useCreateProjectStore } from "@/app/(client)/stores/useCreateProjectStore";

export default function IdeaPage() {
  const { idea } = useCreateProjectStore();

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
        <IdeaRefinement />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full flex justify-center flex-col items-center"
      >
        {idea ? (
          <IdeaCard
            idea={idea}
            showInterestButton
            showRefineButton={false}
          ></IdeaCard>
        ) : (
          <IdeaSkeletonCard />
        )}
      </motion.div>
    </motion.div>
  );
}
