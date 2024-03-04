import { db } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    await db.notification.deleteMany({
      where: {
        userId,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
