import React, { useEffect, useState } from "react";
import GitHubAvatar from "./Avatar";
import { useSession } from "next-auth/react";
import { getUsername } from "@/app/api/project/github";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface RepoDisplayProps {
  name: string;
  isClickable?: boolean;
  className?: string;
}

const RepoDisplay: React.FC<RepoDisplayProps> = ({
  name,
  isClickable = false,
  className,
}) => {
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

  const avatarAndUsername = (
    <>
      <GitHubAvatar className="w-8 h-8" />
      <span className="mx-2">{username}</span>
    </>
  );

  return (
    <div className={`grid grid-cols-[auto_1fr] gap-2 text-sm ${className}`}>
      {!isClickable && (
        <>
          <span className="font-semibold">GitHub</span>
          <span className="font-semibold">Repository Name</span>
        </>
      )}
      <div className="flex items-center">
        {isClickable ? (
          <Link
            href={`https://github.com/${username}`}
            className={`w-fit ${buttonVariants({
              variant: "link",
              size: "sm",
            })} !px-0`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {avatarAndUsername}
          </Link>
        ) : (
          <>{avatarAndUsername}</>
        )}
        <span className="font-medium text-xl">/</span>
      </div>
      {isClickable ? (
        <Link
          href={`https://github.com/${username}/${name}`}
          className={`w-fit ${buttonVariants({
            variant: "link",
            size: "sm",
          })} !px-0`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </Link>
      ) : (
        <span className="content-center">{name}</span>
      )}
    </div>
  );
};

export default RepoDisplay;
