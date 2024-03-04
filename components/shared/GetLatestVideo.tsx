import { GetLatestUserVideo } from "@/lib/actions/video.actions";
import { formatNumber } from "@/lib/utils";
import { BarChart2, FileImage, MessageSquareText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BiLike } from "react-icons/bi";

const GetLatestVideo = async ({ userId }: { userId: string }) => {
  const video = await GetLatestUserVideo({
    userId,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-sm border border-neutral-600 bg-neutral-700/30 px-12 py-3">
      <h3 className="text-base font-semibold text-gray-100">
        Latest Video Performance
      </h3>
      {video?.thumbnail ? (
        <Image
          src={video?.thumbnail}
          alt="thumbnail"
          width={900}
          height={900}
          className="h-[115px] w-full rounded-sm object-cover object-center"
        />
      ) : (
        <div className="flex h-[115px] w-full flex-col items-center justify-center gap-y-2 rounded-sm border border-neutral-500/70 bg-neutral-800">
          <FileImage size={30} className="text-gray-400" />
          <p className="text-base text-gray-400">No Thumbnail</p>
        </div>
      )}
      <div className="flex w-full items-center justify-start gap-x-5">
        <span className="flex items-center gap-x-1">
          <BarChart2 size={17} className="text-neutral-400" />
          <p className="text-xs font-medium text-neutral-400">
            {formatNumber(video?.views!)}
          </p>
        </span>
        <span className="flex items-center gap-x-1">
          <MessageSquareText size={16} className="text-neutral-400" />
          <p className="text-xs font-medium text-neutral-400">
            {formatNumber(video?.comments.length!)}
          </p>
        </span>
        <span className="flex items-center gap-x-1">
          <BiLike size={16} className="text-neutral-400" />
          <p className="text-xs font-medium text-neutral-400">
            {formatNumber(video?.likes.length!)}
          </p>
        </span>
      </div>
      <div className="h-px w-full bg-neutral-600" />
      <Link
        href={`/watch/${video?.id}`}
        className="text-[15px] font-semibold uppercase text-blue-500 transition hover:text-blue-400"
      >
        go to video
      </Link>
    </div>
  );
};

export default GetLatestVideo;
