"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PartialIdea } from "@/types/idea";
import AIProductManager from "./ai-product-manager";
import AIEngineer from "./ai-engineer";
import { motion } from "framer-motion";
import { Lightbulb, Rocket } from "lucide-react";

interface ExpandIdeaProps {
  idea: PartialIdea;
}

export default function ExpandIdea({ idea }: ExpandIdeaProps) {
  const router = useRouter();

  const handleCreateProject = () => {
    localStorage.setItem("idea", JSON.stringify(idea));
    router.push("/project/create");
  };

  return (
    <div className="flex flex-col justify-center items-center h-full gap-12 lg:gap-24 mt-4">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold"
        >
          Idea Amplifier <Lightbulb className="inline-block w-10 h-10" />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl max-w-2xl mx-auto"
        >
          {`Let's supercharge your concept and transform it into a fully-fledged
          project plan. Our AI-powered tools will help you flesh out the details
          and consider all the technical aspects.`}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">{idea.title}</h2>
        <p className="text-xl mb-8">{idea.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <AIProductManager idea={idea} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <AIEngineer idea={idea} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <Button
          size="lg"
          onClick={handleCreateProject}
          className="font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <Rocket className="w-6 h-6" />
          <span>Help Launch This Project</span>
        </Button>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
          Ready to bring your idea to life? Click here to use these ideas as
          starting points for your next project.
        </p>
      </motion.div>
    </div>
  );
}
