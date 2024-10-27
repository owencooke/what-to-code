"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PartialIdea } from "@/types/idea";
import AIProductManager from "./ai-product-manager";
import AIEngineer from "./ai-engineer";
import { motion } from "framer-motion";
import { Lightbulb, Rocket, ArrowRight, ArrowDown } from "lucide-react";

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
    <div className="flex flex-col justify-center items-center min-h-screen w-full py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        {/* <div className="flex flex-col lg:flex-row items-center"> */}
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
            fully-fledged project plan with help from our AI-powered dev team.`}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-12 flex justify-center items-center"
          >
            <Card className="shadow-xl">
              <CardHeader>
                <h2 className="text-2xl font-bold">{idea.title}</h2>
              </CardHeader>
              <CardContent>{idea.description}</CardContent>
            </Card>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Button
            size="lg"
            onClick={handleCreateProject}
            className="font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Rocket className="w-6 h-6" />
            <span>Launch Your Project Journey</span>
          </Button>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
            Ready to bring your expanded idea to life? Click above to start
            crafting your project with our AI-assisted tools and expert
            guidance.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
