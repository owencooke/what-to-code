"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-7xl">what to code</h1>
      <p className="mb-4 text-center">
        helping developers get off the ground running
      </p>
      <div className="flex items-center gap-8">
        <Link
          className={buttonVariants({ variant: "default", size: "lg" })}
          href={"/idea"}
        >
          build something new
        </Link>
        <Link
          className={buttonVariants({ variant: "secondary", size: "lg" })}
          href={"/"}
        >
          find a project
        </Link>
      </div>
    </div>
  );
}
