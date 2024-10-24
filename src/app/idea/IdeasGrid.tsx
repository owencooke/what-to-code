import { Card, CardContent } from "@/components/ui/card";
import { PartialIdea } from "@/types/idea";

export default function IdeasGrid({ ideas }: { ideas: PartialIdea[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {ideas.map((idea) => (
        <Card
          key={idea.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4 flex flex-col h-full">
            <h3 className="font-semibold text-lg">{idea.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-5">
              {idea.description}
            </p>
            <div className="flex-grow text-xs text-muted-foreground">
              <span>❤️ {idea.likes}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
