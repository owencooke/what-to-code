"use client";

import { useState, ChangeEvent } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

export default function Login() {
  const { data: session, status } = useSession();
  const [repoName, setRepoName] = useState<string>("");

  const handleCreateRepo = async () => {
    if (!repoName) {
      alert("Repository name is required");
      return;
    }

    if (!session?.accessToken) {
      alert("Access token is missing");
      return;
    }

    try {
      const response = await axios.post("/api/create-project", {
        repoName,
        accessToken: session.accessToken,
      });

      alert(response.data.message);
    } catch (error) {
      console.error("Error creating repository:", error);
      alert("Failed to create and push project");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {status === "authenticated" ? (
        <div className="text-center">
          <p className="mb-4 text-lg">Signed in as {session.user?.email}</p>
          <input
            type="text"
            value={repoName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRepoName(e.target.value)
            }
            placeholder="Repository name"
            className="mb-2 px-4 py-2 border rounded"
          />
          <button
            onClick={handleCreateRepo}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition mb-4"
          >
            Create Repository
          </button>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={() => signIn("github")}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Login with GitHub
          </button>
        </div>
      )}
    </div>
  );
}
