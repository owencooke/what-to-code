import React, { useEffect, useState } from "react";
import GitHubAvatar from "./Avatar";
import { useSession } from "next-auth/react";
import { getUsername } from "@/app/api/project/github";

interface RepoDisplayProps {
  name: string;
  className?: string;
}

const RepoDisplay: React.FC<RepoDisplayProps> = ({ name, className }) => {
  const [username, setUsername] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUsername = async () => {
      if (session?.accessToken) {
        const fetchedUsername = await getUsername(
          `token ${session.accessToken}`,
        );
        setUsername(fetchedUsername);
      }
    };

    fetchUsername();
  }, [session?.accessToken]);
  return (
    <div className={`grid grid-cols-[auto_1fr] gap-2 text-sm ${className}`}>
      <span className="font-semibold">GitHub</span>
      <span className="font-semibold">Repository Name</span>
      <div className="flex items-center">
        <GitHubAvatar className="w-8 h-8" />
        <span className="ml-2">{username}</span>
        <span className="ml-2 font-bold text-xl">/</span>
      </div>
      <span className="content-center">{name}</span>
    </div>
  );
};

export default RepoDisplay;
