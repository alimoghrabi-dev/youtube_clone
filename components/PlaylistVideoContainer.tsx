import { getUserById } from "@/lib/actions/user.actions";
import FetchSinglePlaylistVideo from "./FetchSinglePlaylistVideo";

interface PlaylistVideoContainerProps {
  videoId: string | undefined;
  videoUserId: string | undefined;
  title: string | null | undefined;
  thumbnail: string | null | undefined;
  userId: string | undefined;
  views: number | null | undefined;
  createdAt: Date | undefined;
}

const PlaylistVideoContainer = async ({
  videoId,
  videoUserId,
  title,
  thumbnail,
  userId,
  views,
  createdAt
}: PlaylistVideoContainerProps) => {
  const videoUser = await getUserById({ id: videoUserId });

  return (
    <FetchSinglePlaylistVideo
      videoId={videoId}
      title={title}
      thumbnail={thumbnail}
      userId={userId}
      username={videoUser?.name}
      views={views}
      createdAt={createdAt}
    />
  );
};

export default PlaylistVideoContainer;
