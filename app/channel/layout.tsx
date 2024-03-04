import ChannelTopNav from "@/components/layout/ChannelTopNav";
import RightSideNav from "@/components/layout/RightSideNav";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "YouTube Studio",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session: UserSession | null = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div>
      <ChannelTopNav />
      <div className="ml-auto w-full bg-[#1a1a1a] sm:w-[calc(100%-64px)] md:w-[calc(100%-240px)]">
        {children}
      </div>
      <RightSideNav />
    </div>
  );
};

export default Layout;
