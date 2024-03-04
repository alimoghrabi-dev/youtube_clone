import { db } from "../prisma";

export async function getUserSerachHistories(params: {
  userId: string | undefined;
}) {
  try {
    const { userId } = params;

    const searchHistories = await db.searchHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    if (!searchHistories) {
      return null;
    }

    return searchHistories;
  } catch (error) {
    console.log("[GET_USER_SEARCH_HISTORY]", error);
  }
}
