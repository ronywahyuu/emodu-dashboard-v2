"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Home, LogOut, Moon, Sun } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import ActionTooltip from "../action-tooltip";

export default function HeaderStudent() {
  const { user, isLoading } = useUser();
  const { theme, setTheme } = useTheme()


  return (
    <header className="bg-white *:
      dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 ease-in-out
    ">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            {/* Logo code here */}
            <Link href="/dashboard/student">

              <Image
                src="/images/logo-text.svg"
                alt="logo"
                width={100}
                height={100}
                className="cursor-pointer"
              />
            </Link>
          </div>


          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              {isLoading ? (
                <Skeleton className="w-10 h-10 rounded-full" />
              ) : !user ? (
                <Link
                  href="/login"
                  className="bg-[#61b0fa] text-white rounded-md px-5 py-2.5 text-sm font-medium shadow"
                >
                  Login
                  {/* <button >
                  </button> */}
                  {/* <Button text="Login" color="text-white" bgColor="bg-teal-600" /> */}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  {/*GO BACK HOME BUTTON*/}
                  <ActionTooltip label="Back to home">

                    <Link href="/">
                      <Button
                        variant="ghost"
                        className="rounded"
                      >
                        <Home />
                      </Button>
                    </Link>
                  </ActionTooltip>
                  <Button variant="outline" className="rounded"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? <Sun /> : <Moon />}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage
                          // src="https://github.com/shadcn.png"
                          src={user?.picture as string}
                          alt="Avatar picture"
                        />
                        <AvatarFallback>
                          {/* take first letter from each word of name */}
                          {user.name ? user?.name.split(" ").map((name) => name[0]) : "U"}
                        </AvatarFallback>                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <a href="/api/auth/logout">
                          <DropdownMenuItem className="cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                          </DropdownMenuItem>
                        </a>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Mobile menu button code here */}
          </div>
        </div>
      </div>
    </header>
  );
}
