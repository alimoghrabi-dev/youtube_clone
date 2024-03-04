import { getUserById } from "@/lib/actions/user.actions";
import FetchSingleVideoForSearch from "./FetchSingleVideoForSearch";

interface VideoUserContainerProps {
  userId: string;
  videoId: string;
  title: string | null;
  thumbnail: string | null;
  views: number | null;
  description: string | null;
  createdAt: Date;
}

const VideoUserContainer = async ({
  userId,
  videoId,
  title,
  thumbnail,
  views,
  description,
  createdAt,
}: VideoUserContainerProps) => {
  const user = await getUserById({
    id: userId,
  });

  return (
    <div className="flex w-full md:w-[80%]">
      <FetchSingleVideoForSearch
        userId={userId}
        videoId={videoId}
        title={title}
        thumbnail={thumbnail}
        views={views}
        createdAt={createdAt}
        profilePicture={user?.profilePicture}
        name={user?.name}
        description={description}
      />
    </div>
  );
};

export default VideoUserContainer;
