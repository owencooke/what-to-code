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

type FeatureCardProps = {
  className?: string;
  feature: Feature;
  selected?: boolean;
};

export default function FeatureCard({
  className,
  feature,
  selected,
}: FeatureCardProps) {
  return (
    // <Toggle variant="outline" className="p-0 m-0 text-left">
    <Card className={`w-[350px] text-sm ${className}`}>
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
    // </Toggle>
  );
}
