import { db } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { videoId, currentUserId } = await request.json();

    const video = await db.video.findFirst({
      where: {
        id: videoId,
      },
    });

    if (video?.likes.includes(currentUserId)) {
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
    } else {
      await db.video.update({
        where: {
          id: videoId,
        },
        data: {
          likes: {
            push: [currentUserId],
          },
        },
      });
    }

    if (video?.dislikes.includes(currentUserId)) {
      await db.video.update({
        where: {
          id: videoId,
        },
        data: {
          dislikes: {
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
