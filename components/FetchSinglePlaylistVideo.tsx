"use client";

import { calculateTimeAgo, formatNumber } from "@/lib/utils";
import { Dot, FileImage } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FetchSinglePlaylistVideoProps {
  videoId: string | undefined;
  title: string | null | undefined;
  thumbnail: string | null | undefined;
  userId: string | undefined;
  username: string | undefined;
  views: number | null | undefined;
  createdAt: Date | undefined;
}

const FetchSinglePlaylistVideo = ({
  videoId,
  title,
  thumbnail,
  userId,
  username,
  views,
  createdAt,
}: FetchSinglePlaylistVideoProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/watch/${videoId}`)}
      className="flex cursor-pointer gap-x-2.5 rounded-lg p-3 transition-all hover:bg-neutral-800/75"
    >
      <div className="relative h-[120px] w-[220px]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt="thumbnail"
            fill
            className="rounded-lg object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-2 rounded-lg bg-neutral-800">
            <FileImage size={30} className="text-gray-400" />
            <p className="text-lg text-gray-400">No Thumbnail</p>
          </div>
        )}
      </div>
      <div className="flex max-w-[75%] flex-col gap-y-2">
        <p className="line-clamp-2 break-words text-lg font-semibold text-gray-100">
          {title}
        </p>
        <span className="flex items-center">
          <Link
            href={`/profile/${userId}`}
            className="text-sm font-medium text-neutral-400 transition hover:text-neutral-200"
          >
            {username}
          </Link>
          <Dot size={20} className="text-neutral-400" />
          <p className="text-sm font-medium text-neutral-400">
            {formatNumber(views || 0)} views
          </p>
          <Dot size={20} className="text-neutral-400" />
          <p className="text-sm font-medium text-neutral-400">
            {calculateTimeAgo(createdAt!)}
          </p>
        </span>
      </div>
    </div>
  );
};

export default FetchSinglePlaylistVideo;
