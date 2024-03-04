import {
  CircleUserRound,
  Menu,
  MenuIcon,
  PlaySquare,
  PlusSquare,
  SquarePen,
} from "lucide-react";
import Image from "next/image";
import NavSearchBar from "../NavSearchBar";
import HoverIcon from "../shared/HoverIcon";
import UserDropMenu from "../UserDropMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import SidebarSheet from "./SidebarSheet";
import FetchUserNotifications from "../shared/FetchUserNotifications";
import { getUserNotifications } from "@/lib/actions/notification.actions";
import { Notification } from "@prisma/client";
import { getUserSerachHistories } from "@/lib/actions/searchhistory.action";

const Navbar = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  const userNotifications: Notification[] | undefined =
    await getUserNotifications({
      userId: session?.user.id,
    });

  const searchHistories = await getUserSerachHistories({
    userId: session?.user.id,
  });

  return (
    <div className="sticky inset-x-0 top-0 z-50 flex w-full items-center justify-between gap-x-5 border-b border-neutral-800/75 bg-background bg-neutral-900 px-4 py-5 sm:px-10 md:gap-x-10">
      <div className="flex flex-shrink-0 items-center gap-x-5">
        <Sheet>
          <SheetTrigger className="block outline-none sm:hidden">
            <Menu />
          </SheetTrigger>
          <SheetContent side={"left"} className="w-[250px] border-none p-0">
            <SidebarSheet />
          </SheetContent>
        </Sheet>
        <MenuIcon
          size={36}
          className="hidden cursor-pointer rounded-full p-1.5 transition hover:bg-neutral-800"
        />
        <Link href={"/"}>
          <Image
            src="/nav-logo.png"
            alt="nav_logo"
            quality={100}
            width={90}
            height={90}
            className="mb-0.5"
          />
        </Link>
      </div>

      <NavSearchBar
        userId={session?.user.id}
        searchHistories={searchHistories}
      />

      <div className="flex items-center gap-x-2.5">
        {session ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <HoverIcon
                  icon={PlusSquare}
                  content="Create"
                  size={40}
                  className="cursor-pointer rounded-full p-2 transition hover:bg-neutral-800"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 space-y-1 rounded-lg border-0 bg-neutral-800 px-0 py-2 text-gray-50">
                <DropdownMenuItem asChild>
                  <Link
                    href="/channel/content"
                    className="flex w-full items-center gap-x-3 px-4 py-2.5 text-sm font-normal hover:bg-neutral-700"
                  >
                    <PlaySquare size={19} />
                    Upload Video
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/profile/${session?.user?.id}/community`}
                    className="flex w-full items-center gap-x-3 px-4 py-2.5 text-sm font-normal hover:bg-neutral-700"
                  >
                    <SquarePen size={19} />
                    Create Post
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <FetchUserNotifications
              notifications={userNotifications}
              userId={session?.user?.id}
            />

            <UserDropMenu
              userId={session?.user?.id}
              userImage={session?.user?.image}
              name={session?.user?.name}
              username={session?.user?.username}
            />
          </>
        ) : (
          <Link
            href={"/login"}
            className="flex items-center gap-x-2 rounded-full border border-slate-400/50 bg-background px-4 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-500/20"
          >
            <CircleUserRound size={20} />
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
