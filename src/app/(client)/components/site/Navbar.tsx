"use client";

import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/app/(client)/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/(client)/components/ui/sheet";
import { Button, buttonVariants } from "@/app/(client)/components/ui/button";
import { Menu, SquareUserRound } from "lucide-react";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/app/(client)/components/ui/dropdown-menu";
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import GitHubAvatar from "@/app/(client)/components/github/Avatar";
import React from "react";
import Logo from "./Logo";
import { ModeToggle } from "../ThemeToggle";
import { useRouter } from "next/navigation";

interface RouteProps {
  href: string;
  label: string;
  children?: RouteProps[];
}

const routeList: RouteProps[] = [
  {
    href: "/idea",
    label: "Ideas",
    children: [
      { href: "/idea", label: "Explore" },
      { href: "/idea/generate", label: "Generate New" },
      { href: "/idea/new", label: "Use My Own" },
    ],
  },
  {
    href: "/project",
    label: "Projects",
    children: [
      {
        href: "/project",
        label: "Explore",
      },
      {
        href: "/project/docs",
        label: "Generate Docs",
      },
    ],
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
  const router = useRouter();

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

  const renderMobileNavItems = (items: RouteProps[], level: number = 0) =>
    items.map(({ href, label, children }: RouteProps) => (
      <div key={label} className={`ml-${level * 4}`}>
        {children ? (
          <>
            <div className="mb-2 underline">{label}</div>
            {renderMobileNavItems(children, level + 1)}
          </>
        ) : (
          <Link
            href={href}
            onClick={() => setIsOpen(false)}
            className={buttonVariants({
              variant: "ghost",
              className: "mb-1",
            })}
          >
            {label}
          </Link>
        )}
      </div>
    ));

  const renderDesktopNavItems = (items: RouteProps[]) =>
    items.map(({ href, label, children }: RouteProps) => {
      if (children) {
        return (
          <NavigationMenuItem key={label}>
            <NavigationMenuTrigger className="!bg-transparent">
              {label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[350px] pb-2 pr-6 md:grid-cols-2 list-none">
                {children.map((child) => (
                  <li key={child.label} className="w-full">
                    <NavigationMenuLink asChild className="w-full">
                      <Link
                        href={child.href}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        <span className="text-left w-full">{child.label}</span>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        );
      } else {
        return (
          <NavigationMenuItem key={label}>
            <Link href={href} className={buttonVariants({ variant: "ghost" })}>
              {label}
            </Link>
          </NavigationMenuItem>
        );
      }
    });

  const handleDashboardClick = () => {
    router.push("/dashboard");
    setIsOpen(false);
  };

  const authMenuItem = (
    <MenuItem
      logo={isSignedIn ? <LogOut /> : <LogIn />}
      text={isSignedIn ? "Sign Out" : "Sign In"}
    />
  );

  const dashboardMenuItem = (
    <MenuItem logo={<SquareUserRound />} text="Dashboard" />
  );

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-background">
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
                  <SheetTitle className="font-bold text-xl mb-4">
                    what to code
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                  {renderMobileNavItems(routeList)}
                </nav>
                <div className="absolute bottom-8 left-4 right-4">
                  <div className="flex flex-col gap-4">
                    {isSignedIn && (
                      <>
                        <div className="flex gap-2 items-center justify-center">
                          <GitHubAvatar />
                          <span className="font-medium">{greetUser()}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDashboardClick}
                        >
                          {dashboardMenuItem}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAuthAction}
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
            {renderDesktopNavItems(routeList)}
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
                    <DropdownMenuItem onClick={handleDashboardClick}>
                      {dashboardMenuItem}
                    </DropdownMenuItem>
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
