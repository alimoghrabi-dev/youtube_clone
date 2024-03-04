import { db } from "../prisma";

export async function getCommentById(id: string | null) {
  try {
    if (!id) return null;

    const comment = await db.comment.findFirst({
      where: {
        id,
      },
    });

    return comment;
  } catch (error) {
    console.log("[GET_COMMENT_BY_ID]", error);
  }
}
