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
import GitHubAvatar from "@/components/github/Avatar";

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

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex min-w-fit h-full !mt-0">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold md:text-base"
            >
              <div className="relative w-10 h-9 min-w-10">
                <Code2 className="h-5 absolute bottom-0 left-0" />
                <MessageCircleQuestion className="h-5 absolute top-0 right-0" />
              </div>
              <span className="font-bold text-xl">what to code</span>
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
                  <SheetTitle className="font-bold text-xl">
                    what to code
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col justify-between items-center h-full pb-12">
                  <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                    {routeList.map(({ href, label }: RouteProps) => (
                      <a
                        rel="noreferrer noopener"
                        key={label}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {label}
                      </a>
                    ))}
                  </nav>
                  <div className="flex flex-col justify-center gap-4">
                    {isSignedIn && (
                      <>
                        <div className="flex flex-col gap-4 items-center">
                          {greetUser()}
                          <GitHubAvatar
                            avatar={session?.user?.image}
                            className="cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </div>
                        <div className="flex  items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </div>
                      </>
                    )}
                    <div
                      onClick={handleAuthAction}
                      className="flex items-center"
                    >
                      {isSignedIn ? (
                        <LogOut className="mr-2 h-4 w-4" />
                      ) : (
                        <LogIn className="mr-2 h-4 w-4" />
                      )}
                      <span>{isSignedIn ? "Sign Out" : "Sign In"}</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2 w-full pl-4">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex">
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
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
