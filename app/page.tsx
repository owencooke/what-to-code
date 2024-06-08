"use client";

import { buttonVariants } from "@/components/ui/button";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import axios from "axios";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const handleAuthAction = () => {
    if (session) {
      signOut();
    } else {
      signIn("github");
    }
  };

  const handleCreateRepo = async () => {
    if (!session?.accessToken) {
      alert("Access token is missing");
      return;
    }
    try {
      const response = await axios.post("/api/create-project", {
        repoName: "test-repo",
        accessToken: session.accessToken,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error creating repository:", error);
      alert("Failed to create and push project");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isSignedIn={!!session}
        username={session?.user?.email ?? undefined}
        onAuthAction={handleAuthAction}
        onCreateRepo={handleCreateRepo}
      />
      <div className="flex flex-1 flex-col items-center justify-center">
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
      </div>
    </div>
  );
}
