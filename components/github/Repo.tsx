import Link from "next/link";
import Avatar from "./Avatar";
import { useSession } from "next-auth/react";

interface RepoProps {
  repoName: string;
  username: string;
  isClickable?: boolean;
  className?: string;
}

export default function Repo({
  repoName,
  username,
  isClickable = false,
  className,
}: RepoProps) {
  const { data: session } = useSession();
  username = username || session?.username || "";

  const AvatarAndUsername = () => (
    <>
      <Avatar className="w-5 h-5 rounded-full mr-2" username={username} />
      <span className=" text-gray-600 mr-1">{username}</span>
    </>
  );

  const RepoName = () => (
    <span className="font-semibold line-clamp-1">{repoName}</span>
  );

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center">
        {isClickable ? (
          <Link
            href={`https://github.com/${username}`}
            className="flex items-center hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AvatarAndUsername />
          </Link>
        ) : (
          <AvatarAndUsername />
        )}
        <span>/</span>
        {isClickable ? (
          <Link
            href={`https://github.com/${username}/${repoName}`}
            className="hover:underline ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RepoName />
          </Link>
        ) : (
          <RepoName />
        )}
      </div>
    </div>
  );
}
