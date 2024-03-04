import UserInfoPage from "@/components/UserInfoPage";
import { getUserCreatedLinks } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  const userLinks = await getUserCreatedLinks({ userId: session?.user.id });

  return (
    <section className="flex w-full flex-col gap-y-1 bg-neutral-800">
      <div className="flex w-full items-center justify-start px-8 pt-10">
        <h1 className="text-2xl font-semibold text-gray-50">
          Channel Customization
        </h1>
      </div>
      <UserInfoPage
        defaultName={session?.user.name}
        defaultHandle={session?.user.username}
        defaultDescription={session?.user.bio}
        userImage={session?.user.image}
        userId={session?.user.id}
        contactEmail={session?.user.contactEmail}
        userLinks={userLinks || []}
      />
    </section>
  );
};

export default Page;
