"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, X, Check } from "lucide-react";
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
  tags?: string[];
  className?: string;
  initialSearchQuery?: string;
  initialTags?: string[];
}

export default function SearchInput({
  route,
  placeholder = "Search...",
  searchParamKey = "search",
  debounceDelay = 300,
  tags = [],
  initialSearchQuery = "",
  initialTags = [],
  className = "",
}: SearchInputProps) {
  route = route.startsWith("/") ? route : `/${route}`;
  const router = useRouter();

  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [open, setOpen] = useState(false);

  const handleSearch = useDebouncedCallback((term: string) => {
    updateQueryParams(term, selectedTags);
  }, debounceDelay);

  const updateQueryParams = (term: string, tags: string[]) => {
    const params = new URLSearchParams();
    if (term) {
      params.set(searchParamKey, term);
    } else {
      params.delete(searchParamKey);
    }
    if (tags.length > 0) {
      params.set("tags", tags.join(","));
    } else {
      params.delete("tags");
    }
    router.push(`${route}?${params.toString()}`);
  };

  const toggleTopic = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    updateQueryParams(initialSearchQuery, newTags);
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    updateQueryParams(initialSearchQuery, newTags);
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
          defaultValue={initialSearchQuery}
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter tags</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {tags.map((tag) => (
                      <CommandItem key={tag} onSelect={() => toggleTopic(tag)}>
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedTags.includes(tag)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </div>
                        {tag}
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
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 w-full">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag} tag</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
