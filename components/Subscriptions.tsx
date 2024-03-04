import { getUserById } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";
import { getInitials } from "@/lib/utils";

const Subscriptions = ({
  userSubscriptions,
}: {
  userSubscriptions: {
    subscriptions: string[];
  } | null;
}) => {
  return userSubscriptions?.subscriptions.map(async (user) => {
    const currentUser = await getUserById({
      id: user,
    });

    if (!currentUser) return null;

    return (
      <Link
        key={currentUser.id}
        href={`/profile/${currentUser.id}`}
        className="flex w-full items-center justify-start gap-x-4 rounded-md px-0 py-1.5 transition hover:bg-neutral-700/40 max-md:justify-center md:px-3"
      >
        <div className="relative h-8 w-8">
          {currentUser?.profilePicture ? (
            <Image
              src={currentUser?.profilePicture}
              alt="profile"
              fill
              className="rounded-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/80 p-1.5 text-xs font-normal uppercase text-gray-50 sm:text-3xl">
              {getInitials(currentUser?.name || "")}
            </div>
          )}
        </div>
        <p className="hidden text-sm font-normal md:block">
          {currentUser.name}
        </p>
      </Link>
    );
  });
};

export default Subscriptions;
