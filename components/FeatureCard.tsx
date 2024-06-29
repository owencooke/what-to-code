import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Feature } from "@/app/idea/types";

type FeatureCardProps = {
  className?: string;
  feature: Feature;
};

export default function FeatureCard({ className, feature }: FeatureCardProps) {
  return (
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
  );
}
