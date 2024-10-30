"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import categories from "@/app/idea/data/categories";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDown, CheckIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "./ui/utils";

export default function TopicSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    const topicsParam = searchParams.get("topics");
    if (topicsParam) {
      setSelectedTopics(topicsParam.split(","));
    }
  }, [searchParams]);

  const updateQueryParams = (newTopics: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (newTopics.length > 0) {
      params.set("topics", newTopics.join(","));
    } else {
      params.delete("topics");
    }
    router.push(`?${params.toString()}`);
  };

  const toggleTopic = (topic: string) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(newTopics);
    updateQueryParams(newTopics);
  };

  const removeTopic = (topic: string) => {
    const newTopics = selectedTopics.filter((t) => t !== topic);
    setSelectedTopics(newTopics);
    updateQueryParams(newTopics);
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTopics.map((topic) => (
          <Badge key={topic} variant="secondary" className="text-sm">
            {topic}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => removeTopic(topic)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {topic} topic</span>
            </Button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedTopics.length > 0
              ? `${selectedTopics.length} topics selected`
              : "Filter by topic"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search topic..." className="h-9" />
            <CommandList>
              <CommandEmpty>No topic found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category}
                    value={category}
                    onSelect={() => toggleTopic(category)}
                  >
                    {category}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedTopics.includes(category)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
