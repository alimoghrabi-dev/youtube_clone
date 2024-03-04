"use client";

import { cn } from "@/lib/utils";
import { RiPlayList2Line } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons/lib";
import { MdOutlineHome } from "react-icons/md";
import { MdOutlineSubscriptions } from "react-icons/md";

interface SidebarLinkProps {
  label: string;
  href: string;
  isSheet?: boolean;
}

const SidebarLink = ({ label, href, isSheet }: SidebarLinkProps) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  const Icon: IconType | null =
    label === "Home"
      ? MdOutlineHome
      : label === "Subscriptions"
        ? MdOutlineSubscriptions
        : RiPlayList2Line;

  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-x-4 rounded-md px-3 py-2 transition-all",
        isActive ? "bg-neutral-700/40" : "hover:bg-neutral-700/40",
      )}
    >
      {Icon && <Icon size={24} />}
      <p
        className={
          isSheet
            ? "m text-sm font-medium"
            : "hidden text-sm font-medium md:block"
        }
      >
        {label}
      </p>
    </Link>
  );
};

export default SidebarLink;
