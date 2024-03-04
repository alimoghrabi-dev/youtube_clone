"use client";

import { calculateTimeAgo, cn, formatNumber, getInitials } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { BiSolidLike, BiSolidDislike, BiDislike, BiLike } from "react-icons/bi";
import { Check, Dot, FileImage, Loader2, X } from "lucide-react";
import SaveToPlaylistButtton from "./SaveToPlaylistButtton";
import { Playlist, Video } from "@prisma/client";
import toast from "react-hot-toast";

interface VideoDetailsProps {
  currentUserId: string | undefined;
  currentUserImage: string | undefined;
  currentUserName: string | undefined;
  videoUserId: string | undefined;
  videoId: string | undefined;
  title: string | null | undefined;
  views: number | null | undefined;
  likes: String[];
  dislikes: String[];
  userSubscribers: String[];
  description: string | null | undefined;
  userName: string | undefined;
  userImage: string | null | undefined;
  userPlaylists: Playlist[] | null;
  commentsLength: number;
  recommendedVideos: Video[] | undefined | null;
  createdAt: Date;
}

const VideoDetails = ({
  currentUserId,
  currentUserImage,
  currentUserName,
  videoUserId,
  videoId,
  title,
  views,
  likes,
  dislikes,
  userSubscribers,
  description,
  userName,
  userImage,
  userPlaylists,
  commentsLength,
  recommendedVideos,
  createdAt,
}: VideoDetailsProps) => {
  const router = useRouter();

  const pathname = usePathname();
  const isFirstRun = useRef(true);

  const [isSpreaded, setIsSpreaded] = useState<boolean>(false);
  const [isAddingAComment, setIsAddingAComment] = useState<boolean>(false);
  const [isAddingACommentLoading, setIsAddingACommentLoading] =
    useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");

  useEffect(() => {
    const incrementViews = async () => {
      await fetch("/api/video", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
        }),
      });
    };

    if (!isFirstRun.current && pathname === `/watch/${videoId}`) {
      incrementViews();
    } else {
      isFirstRun.current = false;
    }
  }, [pathname, videoId]);

  const handleAddComment = async () => {
    setIsAddingACommentLoading(true);

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          comment: commentInput,
          currentUserId,
          videoUserId,
        }),
      });

      if (response.ok) {
        toast.success("Comment added");

        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("[ADD_COMMENT]", error);
    } finally {
      setIsAddingACommentLoading(false);
      setIsAddingAComment(false);
      setCommentInput("");
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch("/api/like-video", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          currentUserId,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log("[LIKE_VIDEO]", error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch("/api/dislike-video", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          currentUserId,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log("[DISLIKE_VIDEO]", error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUserId,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log("[SUBSCRIBE]", error);
    }
  };

  return (
    <div className="flex w-full flex-row gap-x-5 px-6 pb-3 max-md:flex-col">
      <div className="flex w-full flex-col gap-y-4 md:w-[60%]">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-x-2.5">
            <Link
              href={`/profile/${videoUserId}`}
              className="flex items-center gap-x-2.5"
            >
              {userImage ? (
                <Image
                  src={userImage}
                  alt="profile"
                  width={52}
                  height={52}
                  className="rounded-full object-cover object-center"
                />
              ) : (
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-sm font-normal uppercase text-gray-50 sm:text-3xl">
                  {getInitials(userName || "")}
                </div>
              )}
              <div className="flex flex-col">
                <p className="text-base font-medium text-gray-100">
                  {userName}
                </p>
                <p className="text-[13px] font-normal text-gray-300">
                  {userSubscribers ? formatNumber(userSubscribers.length) : "0"}
                  {userSubscribers.length > 1 || userSubscribers.length === 0
                    ? " subscribers"
                    : " subscriber"}
                </p>
              </div>
            </Link>
            {currentUserId !== videoUserId && (
              <Button
                onClick={handleSubscribe}
                variant={
                  userSubscribers.includes(currentUserId!)
                    ? "ghost"
                    : "secondary"
                }
                className={cn(
                  "ml-3 flex items-center gap-x-2.5 rounded-full",
                  userSubscribers.includes(currentUserId!) &&
                    "bg-neutral-700/60 hover:bg-neutral-700 hover:text-gray-50",
                )}
              >
                {userSubscribers.includes(currentUserId!) ? (
                  <>
                    <X size={20} />
                    Unsubscribe
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Subscribe
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-x-2.5">
            <div className="relative flex items-center rounded-full bg-neutral-700/80">
              <button
                onClick={handleLike}
                className="flex w-[72px] items-center gap-x-2.5 rounded-l-full rounded-r-none bg-neutral-700/60 px-4 py-2.5 text-sm font-normal transition-all hover:bg-neutral-600/80 hover:text-white"
              >
                {likes.includes(currentUserId!) ? (
                  <BiSolidLike size={20} />
                ) : (
                  <BiLike size={20} />
                )}

                {likes ? formatNumber(likes.length) : "0"}
              </button>
              <div className="left-1/2 h-6 w-px bg-neutral-500/60" />
              <button
                onClick={handleDislike}
                className="flex w-[72px] items-center gap-x-2.5 rounded-l-none rounded-r-full bg-neutral-700/60 px-4 py-2.5 text-sm font-normal transition-all hover:bg-neutral-600/80 hover:text-white"
              >
                {dislikes.includes(currentUserId!) ? (
                  <BiSolidDislike size={20} />
                ) : (
                  <BiDislike size={20} />
                )}
                {dislikes ? formatNumber(dislikes.length) : "0"}
              </button>
            </div>

            <SaveToPlaylistButtton
              userPlaylists={userPlaylists}
              videoId={videoId}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2.5 rounded-lg bg-neutral-700/60 p-3">
          <div className="flex items-center gap-x-3.5">
            <p className="text-sm font-medium text-gray-200">
              {views ? `${formatNumber(views)} views` : "no views"}
            </p>
            <p className="text-sm font-medium text-gray-200">
              {calculateTimeAgo(createdAt)}
            </p>
          </div>
          <p
            className={cn(
              "text-sm font-medium text-gray-200",
              !isSpreaded && "line-clamp-2",
            )}
          >
            {description}
          </p>
          {isSpreaded && (
            <Link
              href={`/profile/${videoUserId}`}
              className="flex items-center gap-x-2.5 py-5"
            >
              {userImage ? (
                <Image
                  src={userImage}
                  alt="profile"
                  width={82}
                  height={82}
                  className="rounded-full object-cover object-center"
                />
              ) : (
                <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-sm font-normal uppercase text-gray-50 sm:text-3xl">
                  {getInitials(userName || "")}
                </div>
              )}
              <div className="flex flex-col gap-y-0.5">
                <p className="text-[17px] font-medium text-gray-100">
                  {userName}
                </p>
                <p className="text-sm font-normal text-gray-300">
                  {userSubscribers ? formatNumber(userSubscribers.length) : "0"}
                  {userSubscribers.length > 1 || userSubscribers.length === 0
                    ? " subscribers"
                    : " subscriber"}
                </p>
              </div>
            </Link>
          )}
          <p
            onClick={() => setIsSpreaded((prev) => !prev)}
            className="mt-3 cursor-pointer text-[15px] font-medium text-gray-200"
          >
            {isSpreaded ? "show less" : "... more"}
          </p>
        </div>
        <div className="flex w-full flex-col gap-y-5">
          <h3 className="mt-2 text-2xl font-semibold text-gray-50">
            {formatNumber(commentsLength)} Comments
          </h3>
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full items-center gap-x-2.5">
              {currentUserImage ? (
                <Image
                  src={currentUserImage}
                  alt="profile"
                  width={45}
                  height={45}
                  className="rounded-full object-cover object-center"
                />
              ) : (
                <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-sm font-normal uppercase text-gray-50 sm:text-3xl">
                  {getInitials(currentUserName || "")}
                </div>
              )}
              <input
                onFocus={() => setIsAddingAComment(true)}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border-b-2 border-gray-500 bg-transparent py-0.5 font-medium outline-none transition-all placeholder:text-base placeholder:text-neutral-500 focus:border-gray-300"
              />
            </div>
            {isAddingAComment && (
              <div className="mt-2 flex w-full items-center justify-end gap-x-2">
                <button
                  onClick={() => setIsAddingAComment(false)}
                  className="rounded-full px-3 py-1.5 text-base font-semibold text-gray-200 transition hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!commentInput || isAddingACommentLoading}
                  className="rounded-full bg-blue-600 px-3 py-1.5 text-base font-semibold text-gray-950 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
                >
                  {isAddingACommentLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Comment"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-y-4 py-10 sm:py-0 md:w-[35%]">
        <h3 className="text-xl font-semibold text-gray-50">Recommended</h3>
        {recommendedVideos?.map((video) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className="flex w-full gap-x-3 rounded-md p-1.5 transition hover:bg-black/80"
          >
            <div className="relative h-[120px] w-[380px]">
              {video.thumbnail ? (
                <Image
                  src={video.thumbnail}
                  alt="thumbnail"
                  fill
                  className="rounded-lg object-cover object-center transition-all group-hover:rounded-sm"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-y-2 rounded-lg bg-neutral-800 transition-all group-hover:rounded-none">
                  <FileImage size={30} className="text-gray-400" />
                  <p className="text-lg text-gray-400">No Thumbnail</p>
                </div>
              )}
            </div>

            <div className="flex w-full flex-col gap-y-1">
              <p className="line-clamp-2 max-w-[300px] break-words text-base font-semibold text-gray-50">
                {video.title}
              </p>
              <span className="flex items-center text-gray-300">
                <p className="text-xs font-normal">
                  {formatNumber(video.views)} views
                </p>
                <Dot />
                <p className="text-xs font-normal">
                  {calculateTimeAgo(video.createdAt)}
                </p>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoDetails;
