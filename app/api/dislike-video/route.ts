import { db } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { videoId, currentUserId } = await request.json();

    const video = await db.video.findFirst({
      where: {
        id: videoId,
      },
    });

    if (!video) return new Response("Video not found", { status: 404 });

    if (video.dislikes.includes(currentUserId)) {
      await db.video.update({
        where: {
          id: videoId,
        },
        data: {
          dislikes: {
            set: video.likes.filter((userId) => userId !== currentUserId),
          },
        },
      });
    } else {
      await db.video.update({
        where: {
          id: videoId,
        },
        data: {
          dislikes: {
            push: [currentUserId],
          },
        },
      });
    }

    if (video.likes.includes(currentUserId)) {
      await db.video.update({
        where: {
          id: videoId,
        },
        data: {
          likes: {
            set: video.dislikes.filter((userId) => userId !== currentUserId),
          },
        },
      });
    }

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
