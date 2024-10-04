import React, { forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUser } from "lucide-react";
import { useSession } from "next-auth/react";

interface GitHubAvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  avatar?: string | null;
}

const GitHubAvatar = forwardRef<HTMLDivElement, GitHubAvatarProps>(
  ({ className, avatar, ...props }, ref) => {
    const { data: session } = useSession();
    return (
      <Avatar ref={ref} className={`${className}`} {...props}>
        <AvatarImage src={avatar ?? undefined} alt="GitHub Profile Picture" />
        <AvatarFallback>
          <CircleUser className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    );
  },
);

GitHubAvatar.displayName = "GitHubAvatar";

export default GitHubAvatar;
