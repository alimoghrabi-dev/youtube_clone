import ProfileLinkRoutes from "@/components/ProfileLinkRoutes";
import SubscribeButton from "@/components/shared/SubscribeButton";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getUserById, getUserCreatedLinks } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth-options";
import { cn, formatNumber, getInitials } from "@/lib/utils";
import { UserSession } from "@/types";
import { AlertCircle, ChevronRight, Mail } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const session: UserSession | null = await getServerSession(authOptions);

  return {
    title: `${session?.user.name} - YouTube`,
  };
}
const Layout = async ({
  children,
  params,
}: {
  params: { profileId: string };
  children: React.ReactNode;
}) => {
  const session: UserSession | null = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const userInfo = await getUserById({
    id: params.profileId,
  });

  const userLinks = await getUserCreatedLinks({
    userId: params.profileId,
  });

  return (
    <>
      <div className="mt-8 flex w-full flex-col items-center gap-y-6 px-0 sm:items-start sm:px-28 md:px-44">
        <div className="flex w-full flex-row items-center justify-center gap-x-4 gap-y-3 max-sm:flex-col sm:justify-start sm:gap-x-6">
          <div className="relative h-24 w-24 sm:h-32 sm:w-32">
            {userInfo?.profilePicture ? (
              <Image
                src={userInfo?.profilePicture}
                alt="profile"
                fill
                className="rounded-full object-cover object-center shadow-md shadow-gray-200/10"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/80 p-1.5 text-2xl font-medium uppercase text-gray-50 sm:text-3xl">
                {getInitials(userInfo?.name || "")}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <h2 className="text-2xl font-semibold capitalize sm:text-3xl">
              {userInfo?.name}
            </h2>
            <div className="flex items-center gap-x-2">
              {userInfo?.username ? (
                <p className="text-sm font-normal text-neutral-400 sm:text-base">
                  @{userInfo?.username}.
                </p>
              ) : (
                <p className="text-sm font-normal italic text-neutral-400 sm:text-base">
                  No username yet.
                </p>
              )}
              <p className="text-sm font-normal text-neutral-400 sm:text-base">
                {userInfo?.subscribers
                  ? formatNumber(userInfo?.subscribers.length)
                  : "0"}
                {userInfo?.subscribers.length! > 1 ||
                userInfo?.subscribers.length === 0
                  ? " subscribers"
                  : " subscriber"}
              </p>
            </div>
            <Dialog>
              <DialogTrigger className="line-clamp-1 flex cursor-pointer items-center justify-start gap-x-1 text-sm font-normal text-neutral-400 transition hover:text-gray-100 sm:text-base">
                <p className="line-clamp-1 max-w-xs text-start">
                  {userInfo?.bio ? userInfo?.bio : "No bio yet."}
                </p>
                <ChevronRight size={21} />
              </DialogTrigger>
              <DialogContent className="w-[320px] justify-start overflow-y-auto rounded-lg border-none bg-neutral-800 max-sm:h-[75vh] sm:w-[600px]">
                <div className="flex w-full flex-col items-center gap-y-4">
                  <div className="flex w-full flex-col gap-y-2">
                    <h2 className="text-2xl font-semibold text-gray-50">
                      About
                    </h2>
                    <p className="text-sm font-medium text-gray-200">
                      {userInfo?.bio ? userInfo?.bio : "No bio yet."}
                    </p>
                  </div>
                  {userLinks?.length! > 0 ? (
                    <div className="flex w-full flex-col gap-y-2">
                      <h2 className="text-2xl font-semibold text-gray-50">
                        Links
                      </h2>
                      {userLinks?.map((link) => (
                        <div
                          key={link.id}
                          className="flex w-full items-center gap-x-2"
                        >
                          <p className="text-sm font-medium text-gray-200">
                            - {link.title}:
                          </p>
                          <a
                            href={link.url}
                            target="_blank"
                            className="line-clamp-1 max-w-[250px] text-sm font-medium text-blue-500 hover:underline"
                          >
                            {link.url}:
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex w-full flex-col gap-y-2">
                    <h2 className="text-2xl font-semibold text-gray-50">
                      Channel Details
                    </h2>
                    <div className="flex items-center gap-x-2.5 text-gray-200">
                      <Mail size={20} />
                      <p className="text-sm font-medium">
                        {userInfo?.contactEmail
                          ? userInfo?.contactEmail
                          : userInfo?.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-2 text-gray-200">
                      <AlertCircle size={20} />
                      <p className="text-sm font-medium">
                        Joined {userInfo?.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {userInfo?.id === session.user.id ? (
              <Link
                href={`/channel/customization`}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className:
                      "mt-2 rounded-full bg-neutral-700/75 px-4 text-sm font-medium hover:bg-neutral-600 hover:text-white",
                  }),
                )}
              >
                Customize
              </Link>
            ) : (
              <SubscribeButton
                userSubscribers={userInfo?.subscribers}
                profileId={userInfo?.id}
                userId={session.user.id}
              />
            )}
          </div>
        </div>
        <div className="flex h-9 items-center gap-x-6">
          <ProfileLinkRoutes profileId={params.profileId} />
        </div>
      </div>
      <div className="h-px w-full bg-neutral-400/25" />
      <div className="flex w-full items-center justify-center px-7 py-9 sm:justify-start sm:px-10 md:px-16">
        {children}
      </div>
    </>
  );
};

export default Layout;
