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

const MobileRightSideNav = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  return (
    <div className="flex h-full w-full flex-col space-y-8 bg-neutral-800 pt-12">
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        {session?.user.image ? (
          <Image
            src={session?.user.image}
            alt="user_image"
            width={750}
            height={750}
            className="h-[75px] w-[75px] rounded-full object-cover object-center "
          />
        ) : (
          <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-xl font-medium uppercase text-gray-50">
            {getInitials(session?.user.name || "")}
          </div>
        )}
        <span className="flex flex-col items-center justify-center space-y-0.5">
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
            isMobile
          />
        ))}
      </div>
    </div>
  );
};

export default MobileRightSideNav;
