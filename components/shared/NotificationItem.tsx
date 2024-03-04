import { getUserById } from "@/lib/actions/user.actions";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import Image from "next/image";
import { calculateTimeAgo, cn, getInitials } from "@/lib/utils";
import { getCommentById } from "@/lib/actions/comment.actions";
import { findVideoById } from "@/lib/actions/video.actions";
import Link from "next/link";
import { FileImage } from "lucide-react";

type NotificationItemProps = {
  commentId: string | null;
  videoId: string | null;
};

const NotificationItem = async ({
  commentId,
  videoId,
}: NotificationItemProps) => {
  let isVideo: boolean;

  const comment = await getCommentById(commentId);

  const video = await findVideoById({
    videoId,
  });

  const userInfo = await getUserById({ id: video?.userId });

  if (comment) {
    isVideo = false;
  } else {
    isVideo = true;
  }

  return (
    <DropdownMenuItem asChild>
      <Link
        href={`/watch/${videoId}`}
        className="flex w-full flex-col px-4 transition hover:bg-neutral-700/70"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-x-2">
            {userInfo?.profilePicture ? (
              <Image
                src={userInfo?.profilePicture}
                alt="profile"
                width={48}
                height={48}
                className="rounded-full object-cover object-center"
              />
            ) : (
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primary/80 p-1.5 text-sm font-normal uppercase text-gray-50 sm:text-3xl">
                {getInitials(userInfo?.name || "")}
              </div>
            )}
            <p
              className={cn(
                "line-clamp-2 flex break-words font-medium text-gray-100",
                isVideo ? "flex-col" : "flex-row gap-x-1",
              )}
            >
              <span className="text-sm font-semibold text-gray-50">
                {isVideo ? (
                  <>{userInfo?.name} Uploaded: </>
                ) : (
                  <>{userInfo?.name} Commented: </>
                )}
              </span>
              {isVideo ? <>{video?.title}</> : <>{comment?.content}</>}
            </p>
          </div>
          {isVideo &&
            (video?.thumbnail ? (
              <Image
                src={video?.thumbnail}
                alt="thumbnail"
                width={900}
                height={900}
                className="h-[70px] w-[105px] rounded-lg object-cover object-center"
              />
            ) : (
              <div className="flex h-[70px] w-[105px] flex-col items-center justify-center gap-y-2 self-end rounded-lg border border-neutral-600 bg-neutral-700/20">
                <FileImage size={20} className="text-gray-400" />
                <p className="text-xs font-medium text-gray-400">
                  No Thumbnail
                </p>
              </div>
            ))}
        </div>
        <p className="mt-1 flex w-full items-start text-xs font-medium text-neutral-500">
          {calculateTimeAgo(isVideo ? video?.createdAt! : comment?.createdAt!)}
        </p>
      </Link>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
