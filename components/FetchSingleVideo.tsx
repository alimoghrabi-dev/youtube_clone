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
  videoId: string;
  title: string | null;
  thumbnail: string | null;
  views: number | null;
  createdAt: Date;
}

const FetchSingleVideo = ({
  userId,
  profilePicture,
  name,
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
      className="group cursor-pointer space-y-2"
    >
      <div className="relative h-[210px] w-full">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt="thumbnail"
            fill
            className="rounded-xl object-cover object-center transition-all group-hover:rounded-sm"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-2 rounded-xl bg-neutral-800 transition-all group-hover:rounded-none">
            <FileImage size={30} className="text-gray-400" />
            <p className="text-lg text-gray-400">No Thumbnail</p>
          </div>
        )}
      </div>
      <div className="flex w-full gap-x-2">
        <Link href={`/profile/${userId}`} className="relative h-10 w-10">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt="profile"
              fill
              className="rounded-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/80 p-1.5 text-sm font-normal uppercase text-gray-50 sm:text-3xl">
              {getInitials(name || "")}
            </div>
          )}
        </Link>
        <div className="flex max-w-[84%] flex-col">
          <p className="line-clamp-2 max-w-full break-words text-base font-medium">
            {title}
          </p>
          <Link
            href={`/profile/${userId}`}
            className="mt-1.5 text-sm font-normal text-gray-300 transition hover:text-white"
          >
            {name}
          </Link>
          <div className="flex items-center">
            <p className="text-[13px] font-normal text-gray-300">
              {views
                ? `${formatNumber(views)} ${views === 1 ? "view" : "views"}`
                : "no views"}
            </p>
            <Dot size={20} className="text-gray-300" />
            <p className="text-[13px] font-normal text-gray-300">
              {calculateTimeAgo(createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FetchSingleVideo;
