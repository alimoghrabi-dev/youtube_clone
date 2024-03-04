import { db } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { videoId, thumbnail } = await request.json();

    await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        thumbnail,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
