import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RiListUnordered } from "react-icons/ri";
import { RiPlayList2Fill } from "react-icons/ri";

interface PlaylistContainerProps {
  playlistId: string;
  title: string;
  coverImage: string | null;
  videosLength: number;
  isPublic: boolean;
}

const PlaylistContainer = ({
  playlistId,
  title,
  coverImage,
  videosLength,
  isPublic,
}: PlaylistContainerProps) => {
  return (
    <Link
      href={`/feed/playlist/${playlistId}`}
      className="flex w-full flex-row gap-x-4 space-y-2 sm:flex-col"
    >
      <div className="group relative flex h-36 w-2/3 justify-center sm:w-full">
        <span className="absolute bottom-1 right-1 z-10 flex items-center gap-x-1 rounded-md bg-neutral-900/85 px-2 py-1 text-gray-50 transition group-hover:opacity-80">
          <RiPlayList2Fill size={11} />
          <p className="text-xs font-normal">
            {videosLength === 1 ? "1 video" : `${videosLength} videos`}
          </p>
        </span>
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="rounded-md object-cover object-center transition hover:brightness-75"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md bg-neutral-800 ring-1 ring-black transition group-hover:brightness-90">
            <RiListUnordered size={26} />
          </div>
        )}
        {coverImage ? (
          <>
            <Image
              src={coverImage}
              alt={title}
              width={900}
              height={900}
              className="absolute -top-3 -z-10 h-12 w-[90%] rounded-md object-cover object-center opacity-40 brightness-90"
            />
            <Image
              src={coverImage}
              alt={title}
              width={900}
              height={900}
              className="absolute -top-1.5 -z-10 h-12 w-[95%] rounded-md object-cover object-center opacity-55 ring-1 ring-black brightness-95"
            />
          </>
        ) : (
          <>
            <div className="absolute -top-3 -z-10 h-12 w-[90%] rounded-md bg-neutral-800 brightness-90 transition" />
            <div className="absolute -top-1.5 -z-10 h-12 w-[95%] rounded-md bg-neutral-800 ring-1 ring-black transition" />
          </>
        )}
      </div>
      <div className="flex flex-col pl-0.5">
        <p className="text-[17px] font-semibold text-gray-50">{title}</p>
        <span className="flex items-center text-sm font-normal text-neutral-400">
          <p>{isPublic ? "Public" : "Private"}</p>
          <Dot />
          <p>Playlist</p>
        </span>
        <p className="text-sm font-semibold text-neutral-400">
          View Full Playlist
        </p>
      </div>
    </Link>
  );
};

export default PlaylistContainer;
