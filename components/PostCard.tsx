"use client";

import { calculateTimeAgo, getInitials } from "@/lib/utils";
import Image from "next/image";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Loader2, MoreVertical } from "lucide-react";
import EditDeletePost from "./EditDeletePost";
import { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface PostCardProps {
  sessionId: string | undefined;
  paramsUserId: string;
  postId: string;
  content: string;
  postImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  userName: string | undefined;
  profilePicture: string | null | undefined;
}

const PostCard = ({
  sessionId,
  paramsUserId,
  postId,
  content,
  postImage,
  createdAt,
  updatedAt,
  userName,
  profilePicture,
}: PostCardProps) => {
  const router = useRouter();

  const [isEdittingForm, setIsEdittingForm] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [input, setInput] = useState<string>(content);

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch("/api/post", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: input,
        }),
      });

      if (response.ok) {
        toast.success("Post updated");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("[UPDATE_POST]", error);
    } finally {
      setIsUpdating(false);
      setIsEdittingForm(false);
      router.refresh();
    }
  };

  return (
    <div className="flex w-full flex-col gap-y-5 rounded-xl border border-neutral-600/85 p-4">
      <div className="flex w-full items-start justify-between">
        <div className="flex w-full gap-x-3.5">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt="profile"
              width={700}
              height={700}
              className="h-[40px] w-[40px] rounded-full object-cover object-center"
            />
          ) : (
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-base font-normal uppercase text-gray-50">
              {getInitials(userName || "")}
            </div>
          )}
          {isEdittingForm ? (
            <div className="flex w-full flex-col items-start gap-y-2.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border-b border-neutral-700/75 bg-transparent py-1 outline-none transition focus-within:border-gray-100"
              />
              <div className="flex items-center gap-x-2">
                <Button
                  onClick={handleUpdate}
                  disabled={input === "" || input === content || isUpdating}
                  size={"sm"}
                  className="rounded-full bg-blue-500/90 text-sm font-medium text-black transition hover:bg-blue-400/80 disabled:bg-neutral-600/80 disabled:text-gray-50"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
                <Button
                  size={"sm"}
                  onClick={() => setIsEdittingForm(false)}
                  variant="ghost"
                  className="rounded-full bg-none text-sm font-medium hover:bg-neutral-700/75 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-y-1">
              <div className="flex items-center gap-x-1">
                <p className="text-sm font-medium capitalize text-gray-50">
                  {userName}
                </p>
                <p>•</p>
                <p className="text-xs font-medium capitalize text-gray-200">
                  {calculateTimeAgo(createdAt)}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-100">{content}</p>
            </div>
          )}
        </div>
        {sessionId === paramsUserId && !isEdittingForm && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical
                size={34}
                className="cursor-pointer rounded-full p-1.5 outline-none transition hover:bg-neutral-700/60"
              />
            </DropdownMenuTrigger>
            <EditDeletePost
              postId={postId}
              setIsEdittingForm={setIsEdittingForm}
            />
          </DropdownMenu>
        )}
      </div>
      {postImage && (
        <Image
          src={postImage}
          alt="post"
          quality={100}
          width={650}
          height={650}
          className="rounded-lg"
        />
      )}
    </div>
  );
};

export default PostCard;
