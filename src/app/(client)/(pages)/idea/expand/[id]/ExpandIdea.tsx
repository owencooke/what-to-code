"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/(client)/components/ui/button";
import { Idea } from "@/types/idea";
import AIProductManager from "./ai-product-manager";
import AIEngineer from "./ai-engineer";
import { motion } from "framer-motion";
import { Rocket, ArrowDown } from "lucide-react";
import { useEffect } from "react";
import { useCreateProjectStore } from "@/app/(client)/stores/useCreateProjectStore";
import { IdeaCard } from "@/app/(client)/components/cards/IdeaCard";

interface ExpandIdeaProps {
  idea: Idea;
}

export default function ExpandIdea({ idea }: ExpandIdeaProps) {
  const router = useRouter();
  const { resetWithIdea, features, frameworks } = useCreateProjectStore();

  useEffect(() => {
    resetWithIdea(idea);
  }, []);

  const handleCreateProject = () => router.push("/project/create");

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full py-8 px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
          <div className="text-center mb-12 flex justify-center items-center flex-col">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-5xl font-bold text-primary mb-4"
            >
              Expand Your Idea
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto"
            >
              {`Let's take your idea to the next level by transforming it into a
            fully-fledged plan with help from our AI-powered project team.`}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-12 flex justify-center items-center"
          >
            <IdeaCard idea={idea} />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex justify-center items-center mb-8"
        >
          <ArrowDown className="w-12 h-12 text-primary animate-bounce" />
        </motion.div>

        <div
          className={`grid grid-cols-1 ${!(frameworks.length || features.length) && "lg:grid-cols-2"} gap-8 mb-12`}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <AIProductManager idea={idea} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <AIEngineer idea={idea} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Button
            size="lg"
            disabled={!(frameworks.length && features.length)}
            onClick={handleCreateProject}
            className="font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Rocket className="w-6 h-6" />
            <span>Help Me Launch This Project</span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
