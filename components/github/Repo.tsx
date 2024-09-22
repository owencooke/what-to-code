import React, { useEffect, useState } from "react";
import GitHubAvatar from "./Avatar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface RepoDisplayProps {
  repoName: string;
  username: string;
  avatar?: string;
  isClickable?: boolean;
  className?: string;
}

const RepoDisplay: React.FC<RepoDisplayProps> = ({
  repoName,
  username,
  avatar,
  isClickable = false,
  className,
}) => {
  const avatarAndUsername = (
    <>
      <GitHubAvatar avatar={avatar} className="w-8 h-8" />
      <span className="mx-2">{username}</span>
    </>
  );

  return (
    <div className={`grid grid-cols-[auto_1fr] gap-2 text-sm ${className}`}>
      {!isClickable && (
        <span className="font-semibold text-base col-span-2">GitHub Repo</span>
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
          {repoName}
        </Link>
      ) : (
        <span className="content-center">{repoName}</span>
      )}
    </div>
  );
};

export default RepoDisplay;
