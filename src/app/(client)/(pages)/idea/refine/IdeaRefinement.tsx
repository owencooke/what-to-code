"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/app/(client)/components/ui/button";
import { RefreshCw, ArrowRight, CircleCheckBig } from "lucide-react";
import { Textarea } from "@/app/(client)/components/ui/textarea";
import { Idea, NewIdea } from "@/types/idea";
import ky from "ky";
import { useCreateProjectStore } from "@/app/(client)/stores/useCreateProjectStore";
import { motion } from "framer-motion";
import { shuffleArray } from "@/lib/utils";
import { refinementOptions } from "@/lib/constants/refinementOptions";

export function IdeaRefinement() {
  const { idea, setIdea } = useCreateProjectStore();
  const [selectedRefinements, setSelectedRefinements] = useState<string[]>([]);
  const [customFeedback, setCustomFeedback] = useState("");
  const [displayedOptions, setDisplayedOptions] = useState<
    typeof refinementOptions
  >([]);

  const getRandomOptions = useCallback(() => {
    const shuffled = shuffleArray(refinementOptions);
    return shuffled.slice(0, 4);
  }, []);

  useEffect(() => {
    setDisplayedOptions(getRandomOptions());
  }, [getRandomOptions]);

  const refreshOptions = () => {
    const newOptions = getRandomOptions();
    setDisplayedOptions(newOptions);
    setSelectedRefinements([]);
  };

  const toggleRefinement = (value: string) => {
    setSelectedRefinements((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleRefinement = async () => {
    if (selectedRefinements.length === 0 && !customFeedback) return;
    setIdea(null);

    const refinePrompt = [...selectedRefinements, customFeedback]
      .filter(Boolean)
      .join(". ");

    const json = {
      idea,
      refinePrompt,
    };

    try {
      const refinedIdea = await ky
        .post("/api/idea/refine", {
          json,
        })
        .json<Idea | NewIdea>();
      setIdea(refinedIdea);
    } catch (error) {
      console.error("Failed to refine idea:", error);
    }
  };

  return (
    <div className="max-w-full lg:w-full mx-auto mt-6">
      <motion.h1
        className="text-4xl lg:text-5xl mb-6 text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        refine your idea
      </motion.h1>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          onClick={refreshOptions}
          variant="ghost"
          size="sm"
          className="col-span-2 w-fit justify-self-center flex items-center justify-center gap-2"
          aria-label="Refresh options"
        >
          <RefreshCw className="h-4 w-4 hover:animate-spin" />
          {/* <span>Refresh options</span> */}
        </Button>
        {displayedOptions.map((option) => {
          const isSelected = selectedRefinements.includes(option.value);
          return (
            <Button
              key={option.value}
              variant={isSelected ? "secondary" : "outline"}
              className="w-full whitespace-normal text-left px-3 py-3 md:py-2 min-h-[3rem] flex justify-between"
              onClick={() => toggleRefinement(option.value)}
            >
              <span className="text-sm leading-tight">{option.label}</span>
              {isSelected && <CircleCheckBig className="h-4 w-4" />}
            </Button>
          );
        })}
      </div>
      <Textarea
        placeholder="Any specific feedback or things you want to change?"
        value={customFeedback}
        onChange={(e) => setCustomFeedback(e.target.value)}
        className="mb-4 h-32"
      />
      <Button
        onClick={handleRefinement}
        disabled={selectedRefinements.length === 0 && !customFeedback}
        className="w-full"
      >
        Refine Idea
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
