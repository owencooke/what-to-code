import { FileText, Globe, Presentation } from "lucide-react";

interface FileType {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const fileTypes: FileType[] = [
  {
    id: "readme",
    label: "README",
    icon: <FileText className="w-6 h-6" />,
    description: "Create a comprehensive project overview for GitHub",
  },
  {
    id: "devpost",
    label: "Devpost",
    icon: <Globe className="w-6 h-6" />,
    description: "Craft a compelling submission for hackathons",
  },
  {
    id: "pitch-deck",
    label: "Pitch Deck",
    icon: <Presentation className="w-6 h-6" />,
    description: "Generate slides to showcase your project",
  },
];
