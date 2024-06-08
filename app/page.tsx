"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-7xl">what to code</h1>
      <p className="mb-6 text-center text-xl">
        helping developers get off the ground running
      </p>
      <div className="flex items-center gap-8 mb-10">
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
          join a project
        </Link>
      </div>
      <Link
        className={buttonVariants({ variant: "link", size: "lg" })}
        href={"/login"}
      >
        login
      </Link>
    </div>
  );
}
