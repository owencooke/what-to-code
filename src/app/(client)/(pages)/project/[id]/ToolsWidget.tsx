import {
  Card,
  CardHeader,
  CardContent,
} from "@/app/(client)/components/ui/card";
import { Badge } from "@/app/(client)/components/ui/badge";
import { Framework } from "@/types/project";

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
              <img
                src={`/tool-logos/${tool.toLowerCase()}.svg`}
                alt={tool}
                width={16}
                height={16}
                className="mr-1"
              />
              {tool}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
