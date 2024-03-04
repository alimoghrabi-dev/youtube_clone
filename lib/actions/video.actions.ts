import { db } from "../prisma";

export async function getPublicVideos() {
  try {
    const publicVideos = await db.video.findMany({
      where: {
        isPublic: false,
      },
    });

    return publicVideos;
  } catch (error) {
    console.log("[GET_PUBLIC_VIDEOS]", error);
  }
}

export async function findVideoById(params: { videoId: string | null }) {
  try {
    if (!params.videoId) return null;

    const video = await db.video.findFirst({
      where: {
        id: params.videoId,
      },
    });

    return video;
  } catch (error) {
    console.log("[GET_PUBLIC_VIDEOS]", error);
  }
}

export async function getUserSubscriptionsVideos(params: {
  userSubscriptions: string[] | undefined;
}) {
  try {
    const { userSubscriptions } = params;

    if (!userSubscriptions) return null;

    const videos = await db.video.findMany({
      where: {
        userId: {
          in: userSubscriptions,
        },
      },
    });

    return videos;
  } catch (error) {
    console.log("[GET_SUBSCRIPTION_VIDEOS]", error);
  }
}

export async function getAllVideoComments(params: {
  videoId: string | undefined;
}) {
  try {
    const { videoId } = params;

    if (!videoId) return null;

    const comments = await db.comment.findMany({
      where: {
        videoId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (error) {
    console.log("[GET_COMMENTS]", error);
  }
}

export async function getRecommendedVideos(params: {
  videoId: string | undefined;
}) {
  try {
    const { videoId } = params;

    if (!videoId) return null;

    let recommendedVideos = [];

    const video = await db.video.findFirst({
      where: {
        id: videoId,
      },
    });

    const originalTitle = video?.title;
    const originalDescription = video?.description;

    const originalWords = new Set([
      ...originalTitle?.split(" ")!,
      ...originalDescription?.split(" ")!,
    ]);

    const videos = await db.video.findMany();

    for (let video of videos) {
      const { title, description } = video;
      const videoWords = new Set([
        ...title?.split(" ")!,
        ...description?.split(" ")!,
      ]);

      //@ts-ignore
      const intersection = [...originalWords].filter((word) =>
        videoWords.has(word),
      );

      if (intersection.length > 0) {
        if (video.id !== videoId) {
          recommendedVideos.push(video);
        }
      }
    }

    return recommendedVideos;
  } catch (error) {
    console.log("[GET_RECOMMENDED_VIDEOS]", error);
  }
}

export async function GetLatestUserVideo(params: { userId: string }) {
  try {
    const { userId } = params;

    const video = await db.video.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return video;
  } catch (error) {
    console.log("[GET_LATEST_USER_VIDEO]", error);
  }
}

export async function getVideosAccoringToQuery(params: { query: string }) {
  try {
    const { query } = params;

    const videos = await db.video.findMany({
      where: {
        title: {
          contains: query,
        },
      },
    });

    const users = await db.user.findMany({
      where: {
        name: {
          contains: query,
        },
      },
    });

    if (!videos || !users) return null;

    return {
      users,
      videos,
    };
  } catch (error) {
    console.log("[GET_VIDEOS_ACCORING_TO_QUERY]", error);
  }
}
