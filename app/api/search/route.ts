import { db } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await db.searchHistory.delete({
      where: {
        id,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, query } = await request.json();

    const searchHistory = await db.searchHistory.findFirst({
      where: {
        label: query,
      },
    });

    if (searchHistory) {
      return new Response("Already searched", { status: 400 });
    }

    await db.searchHistory.create({
      data: {
        userId,
        label: query,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
