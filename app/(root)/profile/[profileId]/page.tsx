import VideoCategories from "@/components/shared/VideoCategories";
import { buttonVariants } from "@/components/ui/button";
import { getUserServerVideos } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth-options";
import { calculateTimeAgo, cn, formatNumber } from "@/lib/utils";
import { SearchParamsProps, UserSession } from "@/types";
import { Dot, FileImage } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: { profileId: string };
  searchParams: SearchParamsProps;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const session: UserSession | null = await getServerSession(authOptions);

  if (!session) redirect("/");

  const userVideos = await getUserServerVideos({
    userId: params.profileId,
    filter: searchParams.filter,
  });

  return userVideos?.length === 0 ? (
    <div className="flex w-full flex-col items-center justify-center gap-y-1.5 py-24">
      <Image
        src={"/empty-home.svg"}
        width={125}
        height={125}
        alt="empty-content"
      />
      <p className="max-w-[325px] text-center text-sm font-normal">
        Upload and record at home or on the go. Everything you make public will
        appear here.
      </p>
      <Link
        href="/upload-video"
        className={cn(
          buttonVariants({
            variant: "secondary",
            className: "mt-3 rounded-full text-base font-medium",
          }),
        )}
      >
        Create
      </Link>
    </div>
  ) : (
    <div className="flex flex-col items-start gap-y-5">
      <VideoCategories />
      <div className="grid w-full grid-cols-1 gap-2.5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {userVideos?.map((video) => (
          <Link
            key={video.id}
            href={`/watch/${video.id}`}
            className="group flex w-full flex-col gap-y-2"
          >
            {video.thumbnail ? (
              <Image
                src={video.thumbnail}
                alt="thumbnail"
                width={900}
                height={900}
                className="h-[150px] w-full rounded-xl object-cover object-center transition-all group-hover:rounded-sm"
              />
            ) : (
              <div className="flex h-[150px] w-full flex-col items-center justify-center gap-y-2 rounded-xl bg-neutral-800 transition-all group-hover:rounded-sm">
                <FileImage size={30} className="text-gray-400" />
                <p className="text-lg text-gray-400">No Thumbnail</p>
              </div>
            )}
            <div className="flex flex-col gap-y-0.5">
              <p className="max-w-full truncate text-base font-medium text-gray-50">
                {video.title}
              </p>
              <div className="flex items-center">
                <p className="text-[13px] font-normal text-gray-300">
                  {video.views
                    ? `${formatNumber(video.views)} ${video.views === 1 ? "view" : "views"}`
                    : "no views"}
                </p>
                <Dot size={20} className="text-gray-300" />
                <p className="text-[13px] font-normal text-gray-300">
                  {calculateTimeAgo(video.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
