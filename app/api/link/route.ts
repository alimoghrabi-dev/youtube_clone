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

    const { title, url } = await request.json();

    if (!title || !url) {
      return new Response("Missing Fields", { status: 400 });
    }

    await db.link.create({
      data: {
        title,
        url,
        userId: session.user.id,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { title, url } = await request.json();

    const link = await db.link.findFirst({
      where: {
        title,
        url,
      },
    });

    if (!link) {
      return new Response("Link not found", { status: 404 });
    }

    await db.link.delete({
      where: {
        id: link.id,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
