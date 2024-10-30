"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "./ui/utils";

interface SearchInputProps {
  route: string;
  placeholder?: string;
  searchParamKey?: string;
  debounceDelay?: number;
  topics?: string[];
  className?: string;
}

export default function SearchInput({
  route,
  placeholder = "Search...",
  searchParamKey = "search",
  debounceDelay = 300,
  topics = [],
  className = "",
}: SearchInputProps) {
  route = route.startsWith("/") ? route : `/${route}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const topicsParam = searchParams.get("topics");
    if (topicsParam) {
      setSelectedTopics(topicsParam.split(","));
    }
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    updateQueryParams(term, selectedTopics);
  }, debounceDelay);

  const updateQueryParams = (term: string, topics: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(searchParamKey, term);
    } else {
      params.delete(searchParamKey);
    }
    if (topics.length > 0) {
      params.set("topics", topics.join(","));
    } else {
      params.delete("topics");
    }
    router.push(`${route}?${params.toString()}`);
  };

  const toggleTopic = (topic: string) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(newTopics);
    updateQueryParams(searchParams.get(searchParamKey) || "", newTopics);
  };

  const removeTopic = (topic: string) => {
    const newTopics = selectedTopics.filter((t) => t !== topic);
    setSelectedTopics(newTopics);
    updateQueryParams(searchParams.get(searchParamKey) || "", newTopics);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative flex-grow w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-10 pr-20 w-full"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get(searchParamKey)?.toString()}
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter topics</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <Command>
                <CommandInput placeholder="Search topics..." />
                <CommandList>
                  <CommandEmpty>No topics found.</CommandEmpty>
                  <CommandGroup>
                    {topics.map((topic) => (
                      <CommandItem
                        key={topic}
                        onSelect={() => toggleTopic(topic)}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedTopics.includes(topic)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <Search className="h-4 w-4" />
                        </div>
                        {topic}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Filter display tags */}
      {selectedTopics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 w-full">
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
      )}
    </div>
  );
}
