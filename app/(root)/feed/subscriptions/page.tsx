import VideoContainer from "@/components/VideoContainer";
import { getUserSubscriptions } from "@/lib/actions/user.actions";
import { getUserSubscriptionsVideos } from "@/lib/actions/video.actions";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Subscriptions - YouTube",
};

const Subscriptions = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  if (!session) redirect("/");

  const userSubscriptions = await getUserSubscriptions({
    userId: session?.user.id,
  });

  const userSubscriptionVideos = await getUserSubscriptionsVideos({
    userSubscriptions: userSubscriptions?.subscriptions,
  });

  return (
    <div className="ml-auto grid w-full grid-cols-1 gap-4 p-4 sm:w-[calc(100%-72px)] md:w-[calc(100%-240px)] md:grid-cols-2 xl:grid-cols-3">
      {userSubscriptionVideos?.map((video) => (
        <VideoContainer
          key={video.id}
          videoId={video.id}
          userId={video.userId}
          title={video.title}
          thumbnail={video.thumbnail}
          views={video.views}
          createdAt={video.createdAt}
        />
      ))}
    </div>
  );
};

export default Subscriptions;
