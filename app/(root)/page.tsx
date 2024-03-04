import VideoContainer from "@/components/VideoContainer";
import Sidebar from "@/components/layout/Sidebar";
import { getPublicVideos } from "@/lib/actions/video.actions";

export default async function Home() {
  const publicVideos = await getPublicVideos();

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-auto grid w-full grid-cols-1 gap-4 gap-y-8 p-4 sm:w-[calc(100%-72px)] md:w-[calc(100%-240px)] md:grid-cols-2 xl:grid-cols-3">
        {publicVideos?.map((video) => (
          <VideoContainer
            key={video.id}
            userId={video.userId}
            videoId={video.id}
            title={video.title}
            thumbnail={video.thumbnail}
            views={video.views}
            createdAt={video.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
