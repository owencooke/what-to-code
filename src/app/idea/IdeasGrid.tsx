"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PartialIdea } from "@/types/idea";

export default function IdeasGrid({
  initialIdeas,
}: {
  initialIdeas: PartialIdea[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {initialIdeas.map((idea) => (
        <Card
          key={idea.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4 flex flex-col h-full">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
              {idea.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-grow">
              {idea.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <span>❤️ {idea.likes}</span>
                {/* <span>🧩 {idea.features?.length || 0}</span> */}
              </div>
              {/* <div className="flex flex-wrap gap-1 justify-end">
                {idea.features?.slice(0, 2).map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {idea.features && idea.features.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{idea.features.length - 2}
                  </Badge>
                )}
              </div> */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
