"use client";

import { calculateTimeAgo, getInitials } from "@/lib/utils";
import Image from "next/image";
import LikeDislikeReplyComment from "./LikeDislikeReplyComment";
import HoverIcon from "./HoverIcon";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CommentComponentProps {
  commentId: string;
  videoId: string;
  userId: string | undefined;
  sessionId: string | undefined;
  content: string;
  userImage: string | null | undefined;
  name: string | undefined;
  username: string | null | undefined;
  likes: String[];
  dislikes: String[];
  createdAt: Date;
}

const CommentComponent = ({
  commentId,
  videoId,
  userId,
  sessionId,
  content,
  name,
  userImage,
  username,
  likes,
  dislikes,
  createdAt,
}: CommentComponentProps) => {
  const router = useRouter();

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleDeleteComment = async () => {
    try {
      const response = await fetch("/api/comment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, userId, videoId }),
      });

      if (response.ok) {
        toast.success("Comment deleted");

        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("[DELETE_COMMENT]", error);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex w-full items-start justify-between gap-x-2.5"
    >
      {userImage ? (
        <Image
          src={userImage}
          alt="profile"
          width={45}
          height={45}
          className="flex-shrink-0 rounded-full object-cover object-center"
        />
      ) : (
        <div className="flex h-[45px] w-[45px] flex-shrink-0 items-center justify-center rounded-full bg-primary/80 p-1.5 text-sm font-normal uppercase text-gray-50 sm:text-3xl">
          {getInitials(name || "")}
        </div>
      )}
      <div className="flex w-full flex-col gap-y-1.5">
        <div className="flex items-center gap-x-2">
          <p className="text-sm font-semibold text-gray-50">@{username}</p>
          <p className="text-xs font-normal text-neutral-400">
            {calculateTimeAgo(createdAt)}
          </p>
        </div>
        <p className="max-w-full break-words text-sm font-normal text-gray-100">
          {content}
        </p>
        <div className="flex items-center gap-x-1">
          <LikeDislikeReplyComment commentId={commentId} />
        </div>
      </div>
      {userId === sessionId && isHovered && (
        <HoverIcon
          icon={Trash}
          content="Delete"
          size={28}
          onClick={handleDeleteComment}
          className="cursor-pointer rounded-full p-1.5 text-red-400 transition hover:bg-neutral-700 hover:text-red-300"
        />
      )}
    </div>
  );
};

export default CommentComponent;
