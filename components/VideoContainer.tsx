import { getUserById } from "@/lib/actions/user.actions";
import FetchSingleVideo from "./FetchSingleVideo";

interface VideoContainerProps {
  userId: string;
  videoId: string;
  title: string | null;
  thumbnail: string | null;
  views: number | null;
  createdAt: Date;
}

const VideoContainer = async ({
  userId,
  videoId,
  title,
  thumbnail,
  views,
  createdAt,
}: VideoContainerProps) => {
  const userInfo = await getUserById({
    id: userId,
  });
  return (
    <FetchSingleVideo
      userId={userId}
      profilePicture={userInfo?.profilePicture}
      name={userInfo?.name}
      videoId={videoId}
      title={title}
      thumbnail={thumbnail}
      views={views}
      createdAt={createdAt}
    />
  );
};

export default VideoContainer;
