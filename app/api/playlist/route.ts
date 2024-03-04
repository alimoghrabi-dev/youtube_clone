import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/prisma";
import { UserSession } from "@/types";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    const session: UserSession | null = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name, isPrivate } = await request.json();

    await db.playlist.create({
      data: {
        title: name,
        isPublic: !isPrivate,
        userId: session.user.id,
      },
    });

    /**await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        playlists: {
          connect: {
            id: playlist.id,
          },
        },
      },
    }); */

    return Response.json("OK", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session: UserSession | null = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { videoId, playlistId } = await request.json();

    const playlist = await db.playlist.findFirst({
      where: {
        id: playlistId,
      },
    });

    const video = await db.video.findFirst({
      where: {
        id: videoId,
      },
    });

    if (playlist?.videos.includes(videoId)) {
      await db.playlist.update({
        where: {
          id: playlistId,
        },
        data: {
          videos: {
            set: playlist.videos.filter((video) => video !== videoId),
          },
        },
      });

      await db.playlist.update({
        where: {
          id: playlistId,
        },
        data: {
          coverImage: "",
        },
      });
    } else {
      if (playlist?.videos.length === 0) {
        await db.playlist.update({
          where: {
            id: playlistId,
          },
          data: {
            coverImage: video?.thumbnail,
          },
        });
      }

      await db.playlist.update({
        where: {
          id: playlistId,
        },
        data: {
          videos: {
            push: [videoId],
          },
        },
      });
    }

    return Response.json("OK", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
