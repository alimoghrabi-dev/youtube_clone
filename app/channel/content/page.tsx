import UserSingleVideo from "@/components/UserSingleVideo";
import { getUserVideos } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  if (!session) redirect("/");

  const userVideos = await getUserVideos({
    userId: session.user.id,
  });

  return (
    <section className="flex w-full flex-col gap-y-1 bg-neutral-800">
      <div className="flex w-full items-center justify-start border-b border-gray-400/20 px-8 py-10">
        <h1 className="text-2xl font-semibold text-gray-50">Channel Content</h1>
      </div>
      {userVideos?.length === 0 && (
        <div className="flex h-[71vh] items-center justify-center bg-neutral-800">
          <h2 className="text-center text-2xl font-semibold text-gray-100">
            No videos found, create some.
          </h2>
        </div>
      )}
      {userVideos?.map((video) => (
        <UserSingleVideo
          key={video.id}
          videoUrl={video.videoUrl}
          title={video.title}
          videoId={video.id}
          description={video.description}
          isPublic={video.isPublic}
          views={video.views}
          createdAt={video.createdAt}
        />
      ))}
    </section>
  );
};

export default Page;
