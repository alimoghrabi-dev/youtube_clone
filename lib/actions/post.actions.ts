import { db } from "../prisma";

export async function getUserFetchedPosts(params: { userId: string }) {
  try {
    const posts = await db.post.findMany({
      where: {
        userId: params.userId,
      },
    });

    if (!posts) return null;

    return posts;
  } catch (error) {
    console.log("[GET_USER_FETCHED_POST]", error);
    return null;
  }
}
