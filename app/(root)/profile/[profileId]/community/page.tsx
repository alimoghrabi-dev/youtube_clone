import PostCard from "@/components/PostCard";
import CreatePostForm from "@/components/shared/CreatePostForm";
import { getUserFetchedPosts } from "@/lib/actions/post.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import { Ghost } from "lucide-react";
import { getServerSession } from "next-auth";

const Page = async ({ params }: { params: { profileId: string } }) => {
  const session: UserSession | null = await getServerSession(authOptions);

  const userPosts = await getUserFetchedPosts({
    userId: params.profileId,
  });

  return (
    <div className="flex w-full flex-col gap-y-8">
      {session?.user.id === params.profileId ? (
        <>
          <CreatePostForm userId={session?.user.id} />
          <div className="h-px w-full bg-neutral-700/40" />
        </>
      ) : null}
      <div className="flex w-full flex-col items-start gap-y-4">
        {userPosts?.length === 0 && (
          <div className="flex w-full flex-col items-center justify-center gap-y-2.5 py-2.5">
            <Ghost size={55} className="rounded-full bg-neutral-700 p-2" />
            <p>This Channel Community is Quite.</p>
          </div>
        )}
        {userPosts?.map(async (post) => {
          const ownerOfThePost = await getUserById({ id: post.userId });

          return (
            <PostCard
              key={post.id}
              sessionId={session?.user.id}
              paramsUserId={params.profileId}
              postId={post.id}
              content={post.content}
              postImage={post.image}
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
              userName={ownerOfThePost?.name}
              profilePicture={ownerOfThePost?.profilePicture}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Page;
