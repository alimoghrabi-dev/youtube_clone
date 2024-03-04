import { db } from "../prisma";

export async function getUserById(params: { id: string | undefined }) {
  try {
    const user = await db.user.findFirst({
      where: {
        id: params.id,
      },
    });

    if (!user) return null;

    return user;
  } catch (error) {
    console.log("[GET_USER_BY_ID]", error);
    return null;
  }
}

export async function getUserCreatedLinks(params: {
  userId: string | undefined;
}) {
  try {
    const userLinks = db.link.findMany({
      where: {
        userId: params.userId,
      },
    });

    if (!userLinks) return null;

    return userLinks;
  } catch (error) {
    console.log("[GET_USER_CREATED_LINK]", error);
    return null;
  }
}

export async function getUserVideos(params: { userId: string | undefined }) {
  try {
    const userVideos = db.video.findMany({
      where: {
        userId: params.userId,
      },
    });

    if (!userVideos) return null;

    return userVideos;
  } catch (error) {
    console.log("[GET_USER_CREATED_LINK]", error);
    return null;
  }
}

export async function getUserSubscriptions(params: {
  userId: string | undefined;
}) {
  try {
    const { userId } = params;

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        subscriptions: true,
      },
    });

    return user;
  } catch (error) {
    console.log("[GET_USER_CREATED_LINK]", error);
    return null;
  }
}

export async function getUserServerVideos(params: {
  userId: string | undefined;
  filter: string;
}) {
  try {
    const { userId, filter } = params;

    let videos;

    if (filter === "latest") {
      videos = await db.video.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (filter === "popular") {
      videos = await db.video.findMany({
        where: {
          userId,
        },
        orderBy: {
          views: "desc",
        },
      });
    } else if (filter === "oldest") {
      videos = await db.video.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    } else {
      videos = await db.video.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return videos;
  } catch (error) {
    console.log("[GET_USER_CREATED_LINK]", error);
    return null;
  }
}

export async function getUserPlaylists(params: { userId: string | undefined }) {
  try {
    const { userId } = params;

    const playlists = await db.playlist.findMany({
      where: {
        userId,
      },
    });

    return playlists;
  } catch (error) {
    console.log("[GET_USER_CREATED_LINK]", error);
    return null;
  }
}
