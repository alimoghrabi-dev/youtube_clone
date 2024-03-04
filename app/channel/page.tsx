import ChannelAnalytics from "@/components/shared/ChannelAnalytics";
import GetLatestVideo from "@/components/shared/GetLatestVideo";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  if (!session) redirect("/");

  return (
    <div className="flex w-full flex-col items-start justify-start px-4 pb-4 sm:px-12">
      <h1 className="py-8 text-2xl font-semibold text-gray-50">
        Channel Dashboard
      </h1>
      <div className="flex w-full flex-wrap justify-start gap-5">
        <GetLatestVideo userId={session.user.id} />
        <ChannelAnalytics
          userId={session.user.id}
          currentSubs={session.user.subscribers.length}
        />
      </div>
    </div>
  );
};

export default Page;
