"use client";

import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Code2,
  LogOut,
  MessageCircleQuestion,
  Settings,
  User,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import GitHubAvatar from "./github/Avatar";

export default function Navbar() {
  const { data: session } = useSession();
  const isSignedIn = useMemo(() => !!session, [session]);

  const handleAuthAction = () => {
    if (session) {
      signOut();
    } else {
      signIn("github");
    }
  };

  const greetUser = () => {
    const firstName = session?.user?.name?.split(" ")[0];
    return firstName ? `Hi, ${firstName}!` : "My Account";
  };

  return (
    <header className="sticky top-0 flex min-h-[64px] items-center gap-4 border-b bg-background px-4 md:px-6 z-20">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <div className="relative w-10 h-9 min-w-10">
            <Code2 className="h-5 absolute bottom-0 left-0" />
            <MessageCircleQuestion className="h-5 absolute top-0 right-0" />
          </div>
          <span>what to code</span>
        </Link>
        <Link
          href="/idea"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Generate Idea
        </Link>
        <Link
          href="/explore"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Explore Projects
        </Link>
      </nav>
      <div className="flex w-10 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <GitHubAvatar
              avatar={session?.user?.image}
              className="cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            {isSignedIn && (
              <>
                <DropdownMenuLabel>{greetUser()}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleAuthAction}>
              {isSignedIn ? (
                <LogOut className="mr-2 h-4 w-4" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              <span>{isSignedIn ? "Sign Out" : "Sign In"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
