import PlaylistContainer from "@/components/PlaylistContainer";
import { getUserPlaylists } from "@/lib/actions/user.actions";
import Image from "next/image";

const Playlists = async ({ params }: { params: { profileId: string } }) => {
  const userPlaylists = await getUserPlaylists({ userId: params.profileId });

  return (
    <div className="flex w-full flex-col items-start gap-y-8">
      {userPlaylists?.length! > 0 && (
        <h2 className="text-2xl font-semibold text-gray-50">
          Created Playlists
        </h2>
      )}

      {userPlaylists?.length! === 0 && (
        <div className="flex w-full flex-col items-center justify-center gap-y-1.5 py-24">
          <Image
            src={"/empty-home.svg"}
            width={125}
            height={125}
            alt="empty-content"
          />
          <h2 className="text-xl font-semibold text-gray-50">
            No Current Playlists
          </h2>
          <p className="max-w-[325px] text-center text-sm font-normal text-neutral-300">
            Store and share your videos with your friends, Create a playlist to
            start.
          </p>
        </div>
      )}

      <div className="grid w-full grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4">
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

export default Playlists;
