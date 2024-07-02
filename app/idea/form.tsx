"use client";

import { useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button, ButtonWithLoading } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { selectRandom } from "@/lib/utils";
import categories from "./data/categories";
import { Idea } from "@/types/idea";

interface IdeaFormProps {
  onSubmit: (idea: Idea) => void;
  onClick: () => void;
}

export function IdeaForm({ onSubmit, onClick }: IdeaFormProps) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");

  const handleNewIdea = async () => {
    onClick();
    let newTopic = topic || selectRandom(categories);
    const response = await fetch(
      `/api/idea?topic=${encodeURIComponent(newTopic)}`,
    );
    if (!response.ok) {
      console.error("Failed to fetch new idea:", response.statusText);
      return;
    }
    const data = await response.json();
    onSubmit(data);
  };

  return (
    <div className="flex gap-8">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {topic
              ? categories.find((category) => category === topic)
              : "any topic is fine!"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="search topic..." className="h-9" />
            <CommandList>
              <CommandEmpty>No topic found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category}
                    value={category}
                    onSelect={(currenttopic) => {
                      setTopic(currenttopic === topic ? "" : currenttopic);
                      setOpen(false);
                    }}
                  >
                    {category}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        topic === category ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <ButtonWithLoading
        type="submit"
        onClick={handleNewIdea}
        loadingText="brainstorming..."
      >
        generate
      </ButtonWithLoading>
    </div>
  );
}
