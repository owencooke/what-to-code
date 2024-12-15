import {
  Card,
  CardHeader,
  CardContent,
} from "@/app/(client)/components/ui/card";
import { Project } from "@/types/project";

export default function ProjectTitleWidget({ project }: { project: Project }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <h1 className="text-3xl font-bold">{project.title}</h1>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{project.description}</p>
      </CardContent>
    </Card>
  );
}
