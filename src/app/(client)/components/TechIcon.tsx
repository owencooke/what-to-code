import { TOOLS } from "@/lib/constants/tools";

interface TechIconProps {
  tool: (typeof TOOLS)[number];
  className?: string;
}

export function TechIcon({ tool, className = "" }: TechIconProps) {
  return (
    <i
      className={`${className} devicon-${tool.toLowerCase()}-original devicon-${tool.toLowerCase()}-plain colored`}
    />
  );
}
