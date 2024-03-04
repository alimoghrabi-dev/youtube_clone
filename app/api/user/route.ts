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

    const { name, handle, description, contactEmail } = await request.json();

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name === session.user.name ? session.user.name : name,
        username:
          handle === session.user.username ? session.user.username : handle,
        bio: description === session.user.bio ? session.user.bio : description,
        contactEmail:
          contactEmail === session.user.contactEmail
            ? session.user.contactEmail
            : contactEmail,
      },
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
