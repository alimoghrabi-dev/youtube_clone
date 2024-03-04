import PlaylistVideoContainer from "@/components/PlaylistVideoContainer";
import { findPlaylistById } from "@/lib/actions/playlist.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { findVideoById } from "@/lib/actions/video.actions";
import { authOptions } from "@/lib/auth-options";
import { calculateTimeAgo } from "@/lib/utils";
import { UserSession } from "@/types";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Playlist = async ({ params }: { params: { playlistId: string } }) => {
  const session: UserSession | null = await getServerSession(authOptions);

  if (!session) redirect("/");

  const playlist = await findPlaylistById({ playlistId: params.playlistId });

  const playlistUser = await getUserById({ id: playlist?.userId });

  const playlistVideos = await Promise.all(
    playlist?.videos.map(async (videoId) => {
      const video = await findVideoById({ videoId });
      return video;
    }) || [],
  );

  return (
    <div className="ml-auto flex w-full flex-col items-start gap-y-8 p-4 sm:w-[calc(100%-72px)] md:w-[calc(100%-240px)]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-end gap-x-2.5">
          <h2 className="text-3xl font-semibold text-gray-50">
            {playlist?.title}
          </h2>
          <p className="text-sm font-medium text-neutral-400">
            Created {calculateTimeAgo(playlist?.createdAt!)}
          </p>
        </div>

        <span className="flex items-center gap-x-2.5">
          <Link
            href={`/profile/${playlistUser?.id}`}
            className="text-base font-semibold text-gray-50 hover:underline hover:underline-offset-2"
          >
            {playlistUser?.name}
          </Link>
          <p className="text-sm font-medium text-neutral-400">
            {playlist?.videos.length || 0} videos
          </p>
        </span>
      </div>
      <div className="flex w-full flex-col gap-y-6">
        {playlistVideos.map((video) => (
          <PlaylistVideoContainer
            key={video?.id}
            videoId={video?.id}
            videoUserId={video?.userId}
            title={video?.title}
            thumbnail={video?.thumbnail}
            userId={video?.userId}
            views={video?.views}
            createdAt={video?.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
