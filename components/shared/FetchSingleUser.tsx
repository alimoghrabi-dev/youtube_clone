"use client";

import { formatNumber, getInitials } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FetchSingleUserProps {
  userId: string;
  profilePicture: string | null | undefined;
  name: string | undefined;
  username: string | null | undefined;
  subscribers: number | undefined;
  bio: string | null | undefined;
}

const FetchSingleUser = ({
  userId,
  profilePicture,
  name,
  username,
  subscribers,
  bio,
}: FetchSingleUserProps) => {
  return (
    <Link
      href={`/profile/${userId}`}
      className="flex w-full gap-x-3 px-4 md:w-[80%]"
    >
      <div className="relative size-16 flex-shrink-0 sm:size-20">
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt="profile"
            fill
            className="rounded-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/80 p-1.5 text-[13px] font-normal uppercase text-gray-50 sm:text-3xl">
            {getInitials(name || "")}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-lg font-medium text-gray-50">{name}</h3>
        <div className="flex flex-col gap-y-1.5">
          <span className="flex items-center">
            <p className="text-xs font-normal text-neutral-400">@{username}</p>
            <Dot size={20} className="text-neutral-400" />
            <p className="text-xs font-medium text-neutral-400">
              {formatNumber(subscribers!)} subscribers
            </p>
          </span>
          <p className="line-clamp-1 max-w-md text-xs font-normal text-neutral-400">
            {bio}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FetchSingleUser;
