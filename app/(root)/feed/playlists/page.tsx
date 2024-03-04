import PlaylistContainer from "@/components/PlaylistContainer";
import { getUserPlaylists } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth-options";
import { UserSession } from "@/types";
import { getServerSession } from "next-auth";

const Playlist = async () => {
  const session: UserSession | null = await getServerSession(authOptions);

  const userPlaylists = await getUserPlaylists({ userId: session?.user.id });

  return (
    <div className="ml-auto flex w-full flex-col gap-y-9 p-4 sm:w-[calc(100%-72px)] md:w-[calc(100%-240px)]">
      <h1 className="text-2xl font-semibold text-gray-50 sm:text-3xl">
        Playlists
      </h1>
      <div className="grid w-full grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {userPlaylists?.map((playlist) => (
          <PlaylistContainer
            key={playlist.id}
            playlistId={playlist.id}
            title={playlist.title}
            coverImage={playlist.coverImage}
            videosLength={playlist.videos.length}
            isPublic={playlist.isPublic}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
