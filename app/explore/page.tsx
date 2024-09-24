"use client";

import { useState } from "react";
import { Search, Github } from "lucide-react";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";

const fetchProjects = async (searchTerm: string): Promise<Project[]> =>
  ky.get("/api/project", { searchParams: { query: searchTerm } }).json();

const debouncedFetchProjects = debounce(fetchProjects, 500);

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: () => debouncedFetchProjects(searchTerm),
  });

  // Update the debounced input value when the search term changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Things Being Coded
      </h1>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          Error: {(error as Error).message}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, id) => (
            <Card key={id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-[#f6f8fa] border-gray-300 hover:bg-[#f3f4f6]"
                  >
                    <Github className="w-4 h-4 text-gray-700" />
                    <span className="sr-only">View on GitHub</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="font-medium">{project.github_user}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {/* {project.tech.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px]"
                        >
                          {tech}
                        </span>
                      ))} */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
