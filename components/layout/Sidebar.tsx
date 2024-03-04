import { UserSession } from "@/types";
import SidebarLink from "./SidebarLink";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getUserSubscriptions } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import Subscriptions from "../Subscriptions";

const topSideLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Subscriptions",
    href: "/feed/subscriptions",
  },
  {
    label: "Playlists",
    href: "/feed/playlists",
  },
];

const Sidebar = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  const userSubscriptions = await getUserSubscriptions({
    userId: session?.user.id,
  });

  return (
    <div className="fixed left-0 z-50 hidden h-screen w-[72px] space-y-2 overflow-y-auto border-r border-neutral-800/80 bg-neutral-900 px-2.5 py-2 sm:block md:w-60">
      <div className="flex w-full flex-col items-center gap-y-1">
        {topSideLinks.map((item) => (
          <SidebarLink key={item.label} label={item.label} href={item.href} />
        ))}
      </div>
      <div className="h-px w-full bg-neutral-700/40" />
      <div
        className={cn(
          "w-full flex-col items-center gap-y-2",
          userSubscriptions?.subscriptions.length === 0 ? "hidden" : "flex",
        )}
      >
        <h4 className="hidden self-start px-3 py-1 text-base font-normal md:block">
          Subscriptions
        </h4>
        <Subscriptions userSubscriptions={userSubscriptions} />
      </div>
    </div>
  );
};

export default Sidebar;
