import { useState } from "react";
import { Button } from "@/app/(client)/components/ui/button";
import { RefreshCw, ArrowRight, CircleCheckBig } from "lucide-react";
import { Textarea } from "@/app/(client)/components/ui/textarea";
import { Idea, NewIdea } from "@/types/idea";
import ky from "ky";
import { useCreateProjectStore } from "@/app/(client)/stores/useCreateProjectStore";
import { motion } from "framer-motion";

// label: what the user sees
// value: piece of a prompt sent to the server
const refinementOptions = [
  { label: "Make it more innovative", value: "Make it more innovative" },
  {
    label: "Simplify the concept",
    value: "Simplify it, easier for a beginner",
  },
  { label: "Add a unique twist", value: "Add a unique twist" },
  { label: "Focus on sustainability", value: "Focus on sustainablility" },
  { label: "Enhance user experience", value: "Enhance user experience" },
  { label: "Incorporate AI/ML", value: "Incorporate more AI/ML" },
];

// TODO:
// - hackathon prize tracks? improved refinement options? better chat interface?
// - add more refinement options, only display a few (3-6) and
//   randomly select or allow thme to refresh options
export function IdeaRefinement() {
  const { idea, setIdea } = useCreateProjectStore();
  const [selectedRefinements, setSelectedRefinements] = useState<string[]>([]);
  const [customFeedback, setCustomFeedback] = useState("");

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

    // Combine refinements and feedback into single prompt
    const refinePrompt = [...selectedRefinements, customFeedback]
      .filter(Boolean)
      .join(". ");

    // Create request body
    const json = {
      idea,
      refinePrompt,
    };

    console.log("Refining idea with:", json);

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
    <div className="max-w-full lg:w-full overflow-x-hidden mx-auto mt-6">
      <motion.h1
        className="text-4xl lg:text-5xl mb-6 text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        refine your idea
      </motion.h1>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {refinementOptions.map((option) => {
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
