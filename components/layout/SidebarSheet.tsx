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
    <div className="z-50 h-full w-full space-y-2 overflow-y-auto bg-neutral-900 px-2.5 py-2 pt-12">
      <div className="flex w-full flex-col items-center gap-y-1">
        {topSideLinks.map((item) => (
          <SidebarLink
            key={item.label}
            label={item.label}
            href={item.href}
            isSheet
          />
        ))}
      </div>
      <div className="h-px w-full bg-neutral-700/40" />
      <div
        className={cn(
          "w-full flex-col items-center gap-y-2",
          userSubscriptions?.subscriptions.length === 0 ? "hidden" : "flex",
        )}
      >
        <h4 className="self-start px-3 py-1 text-base font-normal">
          Subscriptions
        </h4>
        <Subscriptions userSubscriptions={userSubscriptions} />
      </div>
    </div>
  );
};

export default Sidebar;
