"use client";

import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import GitHubAvatar from "@/components/github/Avatar";
import React from "react";
import Logo from "./Logo";
import { ModeToggle } from "../ThemeToggle";

interface RouteProps {
  href: string;
  label: string;
  children?: RouteProps[];
}

const routeList: RouteProps[] = [
  {
    href: "/idea",
    label: "Idea",
    children: [
      { href: "/idea", label: "Brainstorm Ideas" },
      { href: "/idea/generate", label: "Generate Idea" },
      { href: "/idea/create", label: "Use My Idea" },
    ],
  },
  {
    href: "/project",
    label: "Explore Projects",
  },
];

interface MenuItemProps {
  logo: React.ReactElement;
  text: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ logo, text }) => (
  <div className="flex items-center">
    {React.cloneElement(logo, { className: "h-4 w-4" })}
    <span className="ml-2">{text}</span>
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const renderNavItems = (items: RouteProps[], mobile: boolean = false) =>
    items.map(({ href, label, children }: RouteProps) => {
      if (children) {
        if (mobile) {
          return (
            <DropdownMenu key={label}>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "ghost" })}
              >
                {label} <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {children.map((child) => (
                  <DropdownMenuItem key={child.label}>
                    <Link href={child.href} onClick={() => setIsOpen(false)}>
                      {child.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        } else {
          return (
            <NavigationMenuItem key={label}>
              <NavigationMenuTrigger className="!bg-transparent">
                {label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] p-1 md:grid-cols-2 list-none">
                  {children.map((child) => (
                    <li key={child.label} className="w-full">
                      <NavigationMenuLink asChild className="w-full">
                        <Link
                          href={child.href}
                          className={buttonVariants({ variant: "ghost" })}
                        >
                          <span className="text-left w-full">
                            {child.label}
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        }
      } else {
        return (
          <Link
            key={label}
            href={href}
            onClick={() => setIsOpen(false)}
            className={buttonVariants({ variant: "ghost" })}
          >
            {label}
          </Link>
        );
      }
    });

  const authMenuItem = (
    <MenuItem
      logo={isSignedIn ? <LogOut /> : <LogIn />}
      text={isSignedIn ? "Sign Out" : "Sign In"}
    />
  );

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-muted">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-[95vw] flex justify-between items-center">
          <NavigationMenuItem className="flex min-w-fit h-full !mt-0">
            <Link href="/" className="flex items-center gap-2 md:text-base">
              <Logo />
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                />
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-medium text-xl">
                    what to code
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col justify-between items-center h-full pb-12">
                  <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                    {renderNavItems(routeList, true)}
                  </nav>
                  <div className="flex flex-col justify-center items-center gap-4">
                    {isSignedIn && (
                      <div className="flex gap-2 items-center">
                        <GitHubAvatar />
                        <span className="font-medium">{greetUser()}</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      onClick={handleAuthAction}
                      className="flex items-center"
                    >
                      {authMenuItem}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2 w-full pl-4">
            {renderNavItems(routeList)}
          </nav>

          <div className="hidden md:flex gap-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <GitHubAvatar className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                {isSignedIn && (
                  <>
                    <DropdownMenuLabel>{greetUser()}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleAuthAction}>
                  {authMenuItem}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
