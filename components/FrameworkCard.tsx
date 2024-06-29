import { Framework } from "@/app/idea/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toAlphaLowerCase } from "@/lib/utils";
import tools from "@/app/idea/data/tools";
import { Badge } from "./ui/badge";

type FrameworkCardProps = {
  className?: string;
  framework: Framework;
};

export default function FrameworkCard({
  className,
  framework,
}: FrameworkCardProps) {
  return (
    <Card className={`w-[350px] text-sm ${className}`}>
      <CardHeader>
        <CardTitle>{framework.title}</CardTitle>
      </CardHeader>
      <CardContent className="break-words hyphens-auto">
        {framework.description.split(" ").map((word, j) => {
          const tool = framework.tools.find(
            (tool) => toAlphaLowerCase(tool) === toAlphaLowerCase(word),
          );
          if (tool && tools.includes(tool)) {
            const punctuation = word.match(/[^a-zA-Z0-9]+$/)?.[0] || "";
            return (
              <span key={`tool-${j}`}>
                <Badge variant="secondary" className="ml-px mr-1">
                  {punctuation ? word.slice(0, -punctuation.length) : word}
                  <i
                    className={`ml-2 devicon-${tool}-original ml-2 devicon-${tool}-plain colored`}
                  ></i>
                </Badge>
                {punctuation && punctuation + " "}
              </span>
            );
          }
          return word + " ";
        })}
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter> */}
    </Card>
  );
}
