"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface UserDropMenuProps {
  userId: string | undefined;
  userImage: string | undefined;
  name: string | undefined;
  username: string | undefined;
}

const UserDropMenu = ({
  userId,
  userImage,
  name,
  username,
}: UserDropMenuProps) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("[USER_SIGNOUT]", error);
    }
  };

  return (
    <div className="relative ml-1">
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          {userImage ? (
            <Image
              src={userImage}
              alt="user_image"
              width={550}
              height={550}
              className="h-[40px] w-[40px] rounded-full object-cover object-center"
            />
          ) : (
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-[15px] font-medium uppercase text-gray-50">
              {getInitials(name || "")}
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute -top-12 right-7 w-60 rounded-lg border-0 bg-neutral-800 px-0 py-2 text-gray-50">
          <DropdownMenuLabel className="w-full py-3">
            <div className="flex w-full items-center justify-start gap-x-2 px-4">
              {userImage ? (
                <Image
                  src={userImage}
                  alt="user_image"
                  width={550}
                  height={550}
                  className="h-[40px] w-[40px] rounded-full object-cover object-center"
                />
              ) : (
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-[15px] font-medium uppercase text-gray-50">
                  {getInitials(name || "")}
                </div>
              )}

              <div className="flex flex-col items-start">
                <p className="text-base font-medium capitalize">{name}</p>
                <p className="text-sm font-normal text-gray-200">
                  {username ? (
                    `@${username}`
                  ) : (
                    <p className="text-xs italic text-gray-300">
                      No username yet.
                    </p>
                  )}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-700" />
          <div className="space-y-1">
            <DropdownMenuItem asChild>
              <Link
                href={`/profile/${userId}`}
                className="flex w-full items-center gap-x-3 px-4 py-2.5 text-[15px] font-normal hover:bg-neutral-700"
              >
                <User size={20} />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/channel/customization`}
                className="flex w-full items-center gap-x-3 px-4 py-2.5 text-[15px] font-normal hover:bg-neutral-700"
              >
                <Settings size={20} />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-neutral-700" />
            <DropdownMenuItem
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="flex w-full items-center gap-x-3 px-4 text-[15px] font-normal hover:bg-neutral-700"
            >
              <LogOut size={20} />
              Sign out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropMenu;
