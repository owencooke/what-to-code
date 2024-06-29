import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Feature } from "@/app/idea/types";
import { Toggle } from "@/components/ui/toggle";
import { useMemo, useState } from "react";
import { Edit, Edit2, Edit3, EditIcon } from "lucide-react";
import { ChevronRightIcon } from "@radix-ui/react-icons";

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
      className={`w-[350px] text-sm flex ${className} ${
        selected ? "[border-color:var(--border)]" : ""
      } ${isSelectable ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      <div>
        <CardHeader>
          <CardTitle>{feature.title}</CardTitle>
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
      </div>
      {isSelectable && (
        <Button
          className="min-w-[36px] mt-4 mr-4"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
