"use client";

import { calculateTimeAgo, formatNumber, getInitials } from "@/lib/utils";
import { Dot, FileImage } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FetchSingleVideoProps {
  userId: string;
  profilePicture: string | null | undefined;
  name: string | undefined;
  description: string | null;
  videoId: string;
  title: string | null;
  thumbnail: string | null;
  views: number | null;
  createdAt: Date;
}

const FetchSingleVideoForSearch = ({
  userId,
  profilePicture,
  name,
  description,
  videoId,
  title,
  thumbnail,
  views,
  createdAt,
}: FetchSingleVideoProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/watch/${videoId}`);
      }}
      className="flex w-full cursor-pointer gap-x-3 space-y-2 rounded-sm p-2.5 transition hover:bg-neutral-800"
    >
      <div className="relative h-[125px] w-[500px] md:h-[180px]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt="thumbnail"
            fill
            className="rounded-md object-cover object-center transition-all"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-2 rounded-md bg-neutral-800 transition-all">
            <FileImage size={30} className="text-gray-400" />
            <p className="text-lg text-gray-400">No Thumbnail</p>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-y-0.5">
        <h3 className="line-clamp-1 text-lg font-semibold text-gray-50">
          {title}
        </h3>
        <div className="flex items-center">
          <p className="text-xs font-normal text-neutral-400">
            {views
              ? `${formatNumber(views)} ${views === 1 ? "view" : "views"}`
              : "no views"}
          </p>
          <Dot size={20} className="text-neutral-400" />
          <p className="text-xs font-normal text-neutral-400">
            {calculateTimeAgo(createdAt)}
          </p>
        </div>
        <Link
          href={`/profile/${userId}`}
          className="flex items-center gap-x-2 py-2.5"
        >
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt="profile"
              width={900}
              height={900}
              className="h-6 w-6 rounded-full object-cover object-center"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/80 p-1.5 text-xs font-normal uppercase text-gray-50 sm:text-3xl">
              {getInitials(name || "")}
            </div>
          )}
          <p className="text-xs font-medium text-neutral-400 transition hover:text-neutral-300">
            {name}
          </p>
        </Link>
        <p className="line-clamp-1 text-xs font-normal text-neutral-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FetchSingleVideoForSearch;
