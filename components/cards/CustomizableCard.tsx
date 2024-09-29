import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useState, ReactNode } from "react";
import { Edit } from "lucide-react";

type SelectableCardProps = {
  className?: string;
  title: string;
  description: string;
  selected?: boolean;
  onSelect?: () => void;
  renderContent?: () => ReactNode;
  renderFooter?: () => ReactNode;
};

export default function CustomizableCard({
  className = "",
  title,
  description,
  selected = false,
  onSelect,
  renderContent,
  renderFooter,
}: SelectableCardProps) {
  const isSelectable = useMemo(
    () => typeof onSelect === "function",
    [onSelect],
  );

  const handleClick = () => {
    if (isSelectable) {
      onSelect && onSelect();
    }
  };

  return (
    <Card
      className={`min-w-[19.25rem] text-sm ${className} ${
        selected ? "[border-color:var(--accent)]" : ""
      } ${isSelectable ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-start gap-2">
          {title}
          {/* TODO: implement edit functionality, with saveable form modal */}
          {/* {isSelectable && (
            <Button
              type="button"
              className="flex-shrink-0 flex-grow-0 w-9 h-9"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                console.log("edit");
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )} */}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="break-words hyphens-auto">
        {renderContent && renderContent()}
      </CardContent>
      {renderFooter && (
        <CardFooter className="flex justify-between">
          {renderFooter()}
        </CardFooter>
      )}
    </Card>
  );
}
