import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ProgrammingCodeIdeaIcon,
  ProgrammingBrowserIcon,
  ProgrammmingHoldCodeIcon,
  ProgrammingKeyboardTypeIcon,
} from "@/components/landing/Icons";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <ProgrammingCodeIdeaIcon />,
    title: "Ideate",
    description:
      "quickly generate new ideas at random or tailored to your interests",
  },
  {
    icon: <ProgrammingBrowserIcon />,
    title: "Expand",
    description:
      "transform your idea into a project with detailed features and ways to build",
  },
  {
    icon: <ProgrammmingHoldCodeIcon />,
    title: "Kickstart",
    description:
      "get ahead with recommended GitHub templates that match your project's tech stack",
  },
  {
    icon: <ProgrammingKeyboardTypeIcon />,
    title: "Build",
    description:
      "bypass all the boilerplate and dive straight into developing!",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works
        </span>
      </h2>
      <p className="md:w-3/5 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        we help developers avoid {`"coder's block"`} and hit the ground running
        for hackathons, personal projects, and startups
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
