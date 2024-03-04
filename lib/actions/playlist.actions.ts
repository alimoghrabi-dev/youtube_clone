import { db } from "../prisma";

export async function findPlaylistById(params: {
  playlistId: string | undefined;
}) {
  try {
    const { playlistId } = params;

    const playlist = await db.playlist.findFirst({
      where: {
        id: playlistId,
      },
    });

    return playlist;
  } catch (error) {
    console.log("[GET_PLAYLIST_BY_ID]", error);
  }
}
