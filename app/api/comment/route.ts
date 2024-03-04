import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { videoId, comment, currentUserId, videoUserId } =
      await request.json();

    if (!videoId || !comment || !currentUserId) {
      return new Response("Missing fields", { status: 400 });
    }

    const newComment = await db.comment.create({
      data: {
        content: comment,
        videoId,
        userId: currentUserId,
      },
    });

    await db.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        comments: {
          connect: {
            id: newComment.id,
          },
        },
      },
    });

    await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        comments: {
          push: newComment.id,
        },
      },
    });

    await db.notification.create({
      data: {
        userId: videoUserId,
        commentId: newComment.id,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { commentId, userId, videoId } = await request.json();

    if (!commentId) {
      return new Response("Missing fields", { status: 400 });
    }

    const video = await db.video.findFirst({
      where: {
        id: videoId,
      },
    });

    /**await db.user.update({
      where: {
        id: userId,
      },
      data: {
        comments: {
          disconnect: {
            id: commentId,
          },
        },
      },
    }); */

    await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        comments: {
          set: video?.comments.filter((id) => id !== commentId),
        },
      },
    });

    await db.comment.delete({
      where: {
        id: commentId,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
