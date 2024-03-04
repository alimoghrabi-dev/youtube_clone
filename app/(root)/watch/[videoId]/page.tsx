import CommentComponent from "@/components/shared/CommentComponent";
import VideoDetails from "@/components/shared/VideoDetails";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { getUserById, getUserPlaylists } from "@/lib/actions/user.actions";
import {
  findVideoById,
  getAllVideoComments,
  getRecommendedVideos,
} from "@/lib/actions/video.actions";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const video = await findVideoById({ videoId: params.videoId });

  return {
    title: video?.title,
  };
}

const Page = async ({ params }: { params: { videoId: string } }) => {
  const session: UserSession | null = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const video = await findVideoById({ videoId: params.videoId });

  const user = await getUserById({ id: video?.userId });

  if (!video || !user) redirect("/");

  const userPlaylists = await getUserPlaylists({
    userId: session?.user.id,
  });

  const comments = await getAllVideoComments({
    videoId: video?.id,
  });

  const recommendedVideos = await getRecommendedVideos({
    videoId: params.videoId,
  });

  return (
    <div className="flex w-full flex-col gap-y-7 overflow-x-hidden">
      <VideoPlayer playbackId={video?.videoUrl} />
      <VideoDetails
        videoId={video?.id}
        currentUserId={session?.user.id}
        currentUserImage={session?.user.image}
        currentUserName={session?.user.name}
        videoUserId={video?.userId}
        title={video?.title}
        views={video?.views}
        likes={video?.likes}
        dislikes={video?.dislikes}
        userSubscribers={user.subscribers}
        description={video?.description}
        userName={user.name}
        userImage={user.profilePicture}
        userPlaylists={userPlaylists}
        commentsLength={video.comments.length}
        recommendedVideos={recommendedVideos}
        createdAt={video?.createdAt}
      />
      <div className="flex w-full flex-col gap-y-10 px-6 pb-10 md:w-[55%]">
        {comments?.length === 0 && (
          <p className="text-center text-lg font-semibold text-gray-300">
            No comments yet. Be the first to comment!
          </p>
        )}
        {comments?.map(async (comment) => {
          const user = await getUserById({
            id: comment.userId,
          });

          return (
            <CommentComponent
              key={comment.id}
              commentId={comment.id}
              videoId={comment.videoId}
              userId={comment.userId}
              sessionId={session?.user.id}
              content={comment.content}
              userImage={user?.profilePicture}
              name={user?.name}
              username={user?.username}
              likes={comment.likes}
              dislikes={comment.dislikes}
              createdAt={comment.createdAt}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Page;
