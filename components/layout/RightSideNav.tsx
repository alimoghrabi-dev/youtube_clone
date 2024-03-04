import { authOptions } from "@/lib/auth-options";
import { getInitials } from "@/lib/utils";
import { UserSession } from "@/types";
import { getServerSession } from "next-auth";
import Image from "next/image";
import SideChannelLink from "./SideChannelLink";

const navItems = [
  {
    label: "Dashboard",
    href: "/channel",
  },
  {
    label: "Customization",
    href: "/channel/customization",
  },
  {
    label: "Content",
    href: "/channel/content",
  },
];

const RightSideNav = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  return (
    <div className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col space-y-8 border-r border-gray-400/20 bg-neutral-800 pt-24 sm:flex md:w-60">
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        {session?.user.image ? (
          <Image
            src={session?.user.image}
            alt="user_image"
            width={750}
            height={750}
            className="h-[48px] w-[48px] rounded-full object-cover object-center md:h-[75px] md:w-[75px]"
          />
        ) : (
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-base font-medium uppercase text-gray-50 md:h-[75px] md:w-[75px] md:text-xl">
            {getInitials(session?.user.name || "")}
          </div>
        )}
        <span className="hidden flex-col items-center justify-center space-y-0.5 md:flex">
          <p className="text-sm font-semibold text-gray-100">Your Channel</p>
          <p className="text-sm font-normal capitalize text-neutral-400">
            {session?.user.name}
          </p>
        </span>
      </div>
      <div className="flex w-full flex-col">
        {navItems.map((item) => (
          <SideChannelLink
            key={item.label}
            label={item.label}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
};

export default RightSideNav;
