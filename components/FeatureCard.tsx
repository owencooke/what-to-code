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
import { useState } from "react";

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

  const handleClick = () => {
    if (typeof onClick === "function") {
      setSelected(!selected);
      onClick();
    }
  };

  return (
    <Card
      className={`w-[350px] text-sm ${className} ${
        selected ? "[border-color:var(--border)]" : ""
      } ${typeof onClick === "function" ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
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
    </Card>
  );
}
