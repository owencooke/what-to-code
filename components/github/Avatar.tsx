import React, { forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CircleUser } from "lucide-react";
import { useSession } from "next-auth/react";

interface GitHubAvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

const GitHubAvatar = forwardRef<HTMLDivElement, GitHubAvatarProps>(
  ({ className, ...props }, ref) => {
    const { data: session } = useSession();
    return (
      <Avatar ref={ref} className={`${className}`} {...props}>
        <AvatarImage
          src={session?.user?.image || undefined}
          alt="GitHub Profile Picture"
        />
        <AvatarFallback>
          <CircleUser className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    );
  },
);

GitHubAvatar.displayName = "GitHubAvatar";

export default GitHubAvatar;
