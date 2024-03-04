import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Menu, PlusSquare, SquarePen } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import UserDropMenu from "../UserDropMenu";
import UploadVideoDialog from "../UploadVideoDialog";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import MobileRightSideNav from "./MobileRightSideNav";

const ChannelTopNav = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  return (
    <div className="sticky inset-x-0 top-0 z-50 flex w-full items-center justify-between gap-x-5 bg-background bg-neutral-800 px-2 py-3 shadow-md shadow-black/10 sm:px-10 md:gap-x-10">
      <div className="flex items-center gap-x-1.5">
        <div className="hidden max-sm:flex">
          <Sheet>
            <SheetTrigger asChild>
              <Menu size={23} className="cursor-pointer" />
            </SheetTrigger>
            <SheetContent side={"left"} className="w-64 border-black/20 p-0">
              <MobileRightSideNav />
            </SheetContent>
          </Sheet>
        </div>

        <Link
          href={"/channel"}
          className="flex items-center gap-x-1.5 rounded-full"
        >
          <Image src="/logo.png" alt="studio_logo" width={32} height={32} />
          <p className="text-2xl font-semibold text-gray-50">Studio</p>
        </Link>
      </div>
      <div className="flex items-center gap-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-x-2 rounded-sm border border-neutral-600 px-3 py-1.5 text-[15px] font-normal uppercase outline-none transition hover:bg-neutral-700">
            <PlusSquare size={20} className="font-semibold text-primary" />
            Create
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-10 w-[154px] rounded-lg border-0 bg-neutral-900/85 px-0 py-2 text-gray-50">
            <DropdownMenuItem asChild>
              <UploadVideoDialog />
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
        <UserDropMenu
          userId={session?.user?.id}
          userImage={session?.user?.image}
          name={session?.user?.name}
          username={session?.user?.username}
        />
      </div>
    </div>
  );
};

export default ChannelTopNav;
