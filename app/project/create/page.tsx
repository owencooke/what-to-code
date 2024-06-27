"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Idea } from "@/app/idea/types";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Use the useRouter hook
  const [parsedIdea, setParsedIdea] = useState<Idea | null>(null);

  useEffect(() => {
    const ideaParam = searchParams.get("idea");

    try {
      const ideaObject: Idea = JSON.parse(ideaParam || "");
      setParsedIdea(ideaObject);
    } catch (error) {
      // Redirect if no valid idea is found
      console.error("Failed to parse idea", error);
      router.push("/idea");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Display the idea from query params */}
      <p>Idea: {parsedIdea ? parsedIdea.title : "Redirecting..."}</p>
      <Link
        className={buttonVariants({ variant: "default", size: "lg" })}
        href={`/project/create`}
      >
        create project
      </Link>
    </div>
  );
}
