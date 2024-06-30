import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Feature } from "@/types/idea";
import { useMemo, useState } from "react";
import { Edit } from "lucide-react";

type FeatureCardProps = {
  className?: string;
  feature: Feature;
  onClick?: () => void;
};

export default function FeatureCard({
  className = "",
  feature,
  onClick,
}: FeatureCardProps) {
  const [selected, setSelected] = useState(false);
  const isSelectable = useMemo(() => typeof onClick === "function", [onClick]);

  const handleClick = () => {
    if (isSelectable) {
      setSelected(!selected);
      onClick && onClick();
    }
  };

  return (
    <Card
      className={`min-w-[350px] text-sm ${className} ${
        selected ? "[border-color:var(--accent)]" : ""
      } ${isSelectable ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-start gap-2">
          {feature.title}
          {isSelectable && (
            <Button
              className="w-9"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>{feature.userStory}</CardDescription>
      </CardHeader>
      <CardContent className="break-words hyphens-auto">
        <ul>
          {feature.acceptanceCriteria.map((criteria, i) => (
            <li key={i}>{criteria}</li>
          ))}
        </ul>
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter> */}
    </Card>
  );
}
