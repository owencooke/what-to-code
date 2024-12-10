import { useState } from "react";
import { Button } from "@/app/(client)/components/ui/button";
import { RefreshCw, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/(client)/components/ui/tooltip";
import { Textarea } from "@/app/(client)/components/ui/textarea";
import { Idea, NewIdea } from "@/types/idea";
import ky from "ky";

const refinementOptions = [
  { label: "Make it more innovative", value: "innovative" },
  { label: "Simplify the concept", value: "simplify" },
  { label: "Add a unique twist", value: "unique" },
  { label: "Focus on sustainability", value: "sustainable" },
  { label: "Enhance user experience", value: "ux" },
  { label: "Incorporate AI/ML", value: "ai" },
];

interface IdeaRefinementProps {
  idea: Idea | NewIdea;
  onRefine: (refinedIdea: Idea | NewIdea) => void;
}

export function IdeaRefinement({ idea, onRefine }: IdeaRefinementProps) {
  const [selectedRefinements, setSelectedRefinements] = useState<string[]>([]);
  const [customFeedback, setCustomFeedback] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const toggleRefinement = (value: string) => {
    setSelectedRefinements((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleRefinement = async () => {
    if (selectedRefinements.length === 0 && !customFeedback) return;

    setIsRefining(true);
    const params = new URLSearchParams();
    if (selectedRefinements.length > 0) {
      params.append("refinements", selectedRefinements.join(","));
    }
    if (customFeedback) {
      params.append("customFeedback", customFeedback);
    }
    params.append("previousIdea", JSON.stringify(idea));

    try {
      const response = await ky.get(`/api/refine-idea?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to refine idea");
      }
      const refinedIdea = await response.json<Idea | NewIdea>();
      onRefine(refinedIdea);
    } catch (error) {
      console.error("Failed to refine idea:", error);
    } finally {
      setIsRefining(false);
      setSelectedRefinements([]);
      setCustomFeedback("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-2">Refine Your Idea</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {refinementOptions.map((option) => (
          <TooltipProvider key={option.value}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    selectedRefinements.includes(option.value)
                      ? "default"
                      : "outline"
                  }
                  className="w-full justify-start"
                  onClick={() => toggleRefinement(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{option.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <Textarea
        placeholder="Any specific feedback or ideas for refinement?"
        value={customFeedback}
        onChange={(e) => setCustomFeedback(e.target.value)}
        className="mb-4"
      />
      <Button
        onClick={handleRefinement}
        disabled={
          (selectedRefinements.length === 0 && !customFeedback) || isRefining
        }
        className="w-full"
      >
        {isRefining ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Refining...
          </>
        ) : (
          <>
            Refine Idea
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
