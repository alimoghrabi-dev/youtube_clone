import { getUserById } from "@/lib/actions/user.actions";
import FetchSingleUser from "./FetchSingleUser";

interface FetchUserContainerProps {
  userId: string;
}

const FetchUserContainer = async ({ userId }: FetchUserContainerProps) => {
  const user = await getUserById({ id: userId });

  return (
    <FetchSingleUser
      userId={userId}
      profilePicture={user?.profilePicture}
      name={user?.name}
      username={user?.username}
      subscribers={user?.subscribers.length}
      bio={user?.bio}
    />
  );
};

export default FetchUserContainer;
