import {
  Card,
  CardHeader,
  CardContent,
} from "@/app/(client)/components/ui/card";
import { Badge } from "@/app/(client)/components/ui/badge";
import { Framework } from "@/types/project";
import { TechIcon } from "@/app/(client)/components/TechIcon";

export default function ToolsWidget({
  framework,
}: {
  framework: Omit<Framework, "id">;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">{framework.title}</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {framework.tools.map((tool, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center"
            >
              <TechIcon className="mr-1" tool={tool} />
              {tool}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
