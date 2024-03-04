import { db } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const { videoId, title, description } = await request.json();

    const video = await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        title,
        description,
      },
    });

    const user = await db.user.findFirst({
      where: {
        id: video.userId,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    user.subscribers.forEach(async (subscriber) => {
      const user = await db.user.findFirst({
        where: {
          id: subscriber,
        },
      });

      await db.notification.create({
        data: {
          userId: user?.id!,
          videoId: video.id,
        },
      });
    });

    return new Response(JSON.stringify(video), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { videoId } = await request.json();

    await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { videoId } = await request.json();

    await db.video.delete({
      where: {
        id: videoId,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
