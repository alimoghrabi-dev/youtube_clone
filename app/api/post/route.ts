import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, content, image } = await request.json();

    if (!userId || !content) {
      return new Response("Missing fields", { status: 400 });
    }

    await db.post.create({
      data: {
        userId,
        content,
        image,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { postId, content } = await request.json();

    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        content,
      },
    });

    return new Response("Updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { postId } = await request.json();

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return new Response("Deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
