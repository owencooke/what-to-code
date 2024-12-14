"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/(client)/components/ui/card";
import {
  ProgrammingCodeIdeaIcon,
  ProgrammingBrowserIcon,
  ProgrammmingHoldCodeIcon,
  ProgrammingKeyboardTypeIcon,
} from "@/app/(client)/components/landing/Icons";

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

const sectionAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionAnimation}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold"
        variants={cardAnimation}
      >
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works
        </span>
      </motion.h2>
      <motion.p
        className="md:w-3/5 mx-auto mt-4 mb-8 text-xl text-muted-foreground"
        variants={cardAnimation}
      >
        we help developers avoid {`"coder's block"`} and hit the ground running
        for hackathons, personal projects, and startups
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={sectionAnimation}
      >
        {features.map(({ icon, title, description }: FeatureProps) => (
          <motion.div key={title} variants={cardAnimation}>
            <Card>
              <CardHeader>
                <CardTitle className="grid gap-4 place-items-center">
                  {icon}
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>{description}</CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
