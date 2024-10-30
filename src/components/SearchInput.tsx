"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

interface SearchInputProps {
  route: string;
  placeholder?: string;
  searchParamKey?: string;
  debounceDelay?: number;
}

export default function SearchInput({
  route,
  placeholder = "Search...",
  searchParamKey = "search",
  debounceDelay = 300,
}: SearchInputProps) {
  route = route.startsWith("/") ? route : `/${route}`;
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(searchParamKey, term);
    } else {
      params.delete(searchParamKey);
    }
    router.push(`${route}?${params.toString()}`);
  }, debounceDelay);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-10 w-full"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get(searchParamKey)?.toString()}
      />
    </div>
  );
}
