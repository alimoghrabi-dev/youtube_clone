"use client";

import MuxPlayer from "@mux/mux-player-react";
import { BookCheck, File, Pencil, Trash } from "lucide-react";
import { BsPlayBtnFill } from "react-icons/bs";
import HoverIcon from "./shared/HoverIcon";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserSingleVideoProps {
  title: string | null;
  videoId: string;
  description: string | null;
  videoUrl: string | null;
  isPublic: boolean;
  views: number | null;
  createdAt: Date;
}

const UserSingleVideo = ({
  videoUrl,
  title,
  videoId,
  description,
  isPublic,
  views,
  createdAt,
}: UserSingleVideoProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await fetch("/api/video", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
      }),
    });

    if (response.status === 200) {
      toast.success("Video deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete video");
    }
  };

  return (
    <div className="flex h-[152px] w-full items-center border-b border-t border-gray-400/20 pl-5">
      <div className="flex h-full items-center gap-x-4 border-r border-gray-400/20 pr-7">
        <div className="flex h-full w-48 items-center">
          <MuxPlayer playbackId={videoUrl!} accentColor="#FF0000" />
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="line-clamp-1 max-w-[170px] cursor-pointer text-[15px] font-medium text-gray-50 hover:underline">
            {title}
          </p>
          <p className="line-clamp-1 max-w-[170px] text-xs font-normal text-gray-300">
            {description}
          </p>
          <div className="mt-4 flex items-center gap-x-6">
            <HoverIcon
              icon={Pencil}
              size={20}
              className="cursor-pointer text-neutral-500 transition hover:text-neutral-200"
              content="Edit"
            />
            <Link href={`/watch/${videoId}`}>
              <HoverIcon
                icon={BsPlayBtnFill}
                size={20}
                className="cursor-pointer text-neutral-500 transition hover:text-neutral-200"
                content="View"
              />
            </Link>
            <HoverIcon
              onClick={handleDelete}
              icon={Trash}
              size={20}
              className="cursor-pointer text-neutral-500 transition hover:text-neutral-200"
              content="Delete"
            />
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col items-start">
        <div className="flex w-full items-center gap-x-12 border-b border-gray-400/20 px-3 py-2.5">
          <p className="text-[13px] font-normal text-gray-300">Visibility</p>
          <p className="text-[13px] font-normal text-gray-300">Date</p>
          <p className="ml-[22px] text-[13px] font-normal text-gray-300">
            Views
          </p>
        </div>
        <div className="flex items-center gap-x-12 overflow-y-auto px-3 pt-4">
          <p className="flex items-center gap-x-1.5">
            {isPublic ? (
              <>
                <BookCheck size={19} className="text-gray-400" />
                <p className="mt-0.5 text-sm font-normal text-gray-100">
                  Public
                </p>
              </>
            ) : (
              <>
                <File size={17} className="text-gray-400" />
                <p className="mt-0.5 text-xs font-normal text-gray-100">
                  Draft
                </p>
              </>
            )}
          </p>
          <p className="text-xs font-normal text-gray-300">
            {createdAt.toLocaleDateString()}
          </p>
          {views ? (
            <p className="text-xs font-normal text-gray-300">{views}</p>
          ) : (
            <p className="text-xs font-normal text-gray-300">no views</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSingleVideo;
