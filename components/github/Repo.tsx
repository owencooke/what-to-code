import Link from "next/link";

interface RepoDisplayProps {
  repoName: string;
  username: string;
  avatar?: string;
  isClickable?: boolean;
  className?: string;
}

export default function MinimalRepoDisplay({
  repoName,
  username,
  avatar,
  isClickable = false,
  className,
}: RepoDisplayProps) {
  const AvatarComponent = () => (
    <img
      src={avatar || `https://github.com/${username}.png`}
      alt={`${username}'s avatar`}
      className="w-5 h-5 rounded-full mr-2"
    />
  );

  const UsernameComponent = () => (
    <span className=" text-gray-600 mr-1">{username}</span>
  );

  const RepoNameComponent = () => (
    <span className="font-semibold">{repoName}</span>
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
            <AvatarComponent />
            <UsernameComponent />
          </Link>
        ) : (
          <>
            <AvatarComponent />
            <UsernameComponent />
          </>
        )}
        <span>/</span>
        {isClickable ? (
          <Link
            href={`https://github.com/${username}/${repoName}`}
            className="hover:underline ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RepoNameComponent />
          </Link>
        ) : (
          <RepoNameComponent />
        )}
      </div>
    </div>
  );
}
