"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ProfileLinkRoutes = ({ profileId }: { profileId: string }) => {
  const pathname = usePathname();

  const isRouteActive = (route: string) => {
    return pathname === route;
  };

  return (
    <>
      <Link
        href={`/profile/${profileId}`}
        className={cn(
          "h-full text-lg font-medium transition",
          isRouteActive(`/profile/${profileId}`)
            ? "border-gray50 border-b-2 text-gray-50"
            : "border-neutral-500 text-neutral-400 hover:border-b-2",
        )}
      >
        Home
      </Link>
      <Link
        href={`/profile/${profileId}/playlists`}
        className={cn(
          "h-full text-lg font-medium transition",
          isRouteActive(`/profile/${profileId}/playlists`)
            ? "border-b-2 border-gray-50 text-gray-50"
            : "border-neutral-500 text-neutral-400 hover:border-b-2",
        )}
      >
        Playlists
      </Link>
      <Link
        href={`/profile/${profileId}/community`}
        className={cn(
          "h-full text-lg font-medium transition",
          isRouteActive(`/profile/${profileId}/community`)
            ? "border-b-2 border-gray-50 text-gray-50"
            : "border-neutral-500 text-neutral-400 hover:border-b-2",
        )}
      >
        Community
      </Link>
    </>
  );
};

export default ProfileLinkRoutes;
