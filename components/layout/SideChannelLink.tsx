"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineDashboard } from "react-icons/md";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import { GiSparkSpirit } from "react-icons/gi";
import { BiSolidMoviePlay } from "react-icons/bi";

type MyIconType = IconType;

interface SideChannelLinkProps {
  label: string;
  href: string;
  isMobile?: boolean;
}

const SideChannelLink = ({ label, href, isMobile }: SideChannelLinkProps) => {
  const pathname = usePathname();

  const isActiveRoute = pathname === href;

  const Icon: MyIconType =
    label === "Dashboard"
      ? MdOutlineDashboard
      : label === "Customization"
        ? FaWandMagicSparkles
        : label === "Content"
          ? BiSolidMoviePlay
          : GiSparkSpirit;

  return (
    <Link
      href={href}
      className={cn(
        "relative flex w-full items-center gap-x-3 px-5 py-4 text-neutral-500 transition hover:bg-neutral-900/85",
        isActiveRoute && "bg-neutral-900/85 text-primary",
      )}
    >
      {isActiveRoute && (
        <div className="absolute inset-y-0 left-0 w-[5px] bg-primary" />
      )}

      <Icon
        size={24}
        className={isActiveRoute ? "text-primary" : "text-neutral-500"}
      />
      <p
        className={cn(
          "text-base font-medium",
          isMobile ? "block" : "hidden md:block",
        )}
      >
        {label}
      </p>
    </Link>
  );
};

export default SideChannelLink;
