import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
import { ModeToggle } from "../mode-toggle";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/idea",
    label: "Generate Idea",
  },
  {
    href: "/explore",
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

export const Navbar = () => {
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

  const renderNavItems = () =>
    routeList.map(({ href, label }: RouteProps) => (
      <a
        key={label}
        href={href}
        onClick={() => setIsOpen(false)}
        className={buttonVariants({ variant: "ghost" })}
      >
        {label}
      </a>
    ));

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
              <span className="font-medium text-lg">what to code</span>
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-medium text-xl">
                    what to code
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col justify-between items-center h-full pb-12">
                  <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                    {renderNavItems()}
                  </nav>
                  <div className="flex flex-col justify-center items-center gap-4">
                    {isSignedIn && (
                      <>
                        <div className="flex gap-2 items-center">
                          <GitHubAvatar
                            avatar={session?.user?.image}
                            className="cursor-pointer"
                          />
                          <span className="font-medium">{greetUser()}</span>
                        </div>
                        {/* TODO: extra menu items */}
                        {/* <MenuItem logo={<User />} text="Profile" />
                        <MenuItem logo={<Settings />} text="Settings" /> */}
                      </>
                    )}
                    <div
                      onClick={handleAuthAction}
                      className="flex items-center"
                    >
                      {authMenuItem}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2 w-full pl-4">
            {renderNavItems()}
          </nav>

          <div className="hidden md:flex gap-4">
            <ModeToggle />
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
                    {/* TODO: extra menu items */}
                    {/* <DropdownMenuItem>
                      <MenuItem logo={<User />} text="Profile" />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MenuItem logo={<Settings />} text="Settings" />
                    </DropdownMenuItem> */}
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
};
