import CustomizableCard from "./CustomizableCard";
import { Framework } from "@/types/idea";
import { toAlphaLowerCase } from "@/lib/utils";
import tools from "@/app/idea/data/tools";

type FrameworkCardProps = {
  className?: string;
  framework: Framework;
  selected?: boolean;

  onClick?: () => void;
};

export default function FrameworkCard({
  className = "",
  framework,
  selected = false,
  onClick,
}: FrameworkCardProps) {
  return (
    <CustomizableCard
      className={className}
      title={framework.title}
      description={
        <span>
          {framework.description.split(" ").map((word, j) => {
            const tool = framework.tools.find(
              (tool) => toAlphaLowerCase(tool) === toAlphaLowerCase(word),
            );
            if (tool && tools.includes(tool)) {
              const punctuation = word.match(/[^a-zA-Z0-9]+$/)?.[0] || "";
              return (
                <span key={`tool-${j}`} className="font-semibold">
                  {punctuation ? word.slice(0, -punctuation.length) : word}
                  <i
                    className={`ml-2 devicon-${tool}-original ml-2 devicon-${tool}-plain colored`}
                  ></i>
                  {punctuation + " "}
                </span>
              );
            }
            return word + " ";
          })}
        </span>
      }
      selected={selected}
      onSelect={onClick}
    />
  );
}
