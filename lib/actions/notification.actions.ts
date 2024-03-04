import { db } from "../prisma";

export async function getUserNotifications(params: {
  userId: string | undefined;
}) {
  try {
    const userNotifications = await db.notification.findMany({
      where: {
        userId: params.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return userNotifications;
  } catch (error) {
    console.log("[GET_USER_NOTIFICATIONS]", error);
  }
}
