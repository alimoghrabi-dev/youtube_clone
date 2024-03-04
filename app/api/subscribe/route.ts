import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/prisma";
import { UserSession } from "@/types";
import { getServerSession } from "next-auth";

export async function PATCH(request: Request) {
  try {
    const session: UserSession | null = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { videoUserId } = await request.json();

    if (!videoUserId) {
      return new Response("Missing Fields", { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        id: videoUserId,
      },
    });

    const currentUser = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (user?.subscribers.includes(session.user.id)) {
      await db.user.update({
        where: {
          id: videoUserId,
        },
        data: {
          subscribers: {
            set: user.subscribers.filter((id) => id !== session.user.id),
          },
        },
      });

      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          subscriptions: {
            set: currentUser?.subscriptions.filter((id) => id !== videoUserId),
          },
        },
      });
    } else {
      await db.user.update({
        where: {
          id: videoUserId,
        },
        data: {
          subscribers: {
            push: session.user.id,
          },
        },
      });

      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          subscriptions: {
            push: videoUserId,
          },
        },
      });
    }

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
