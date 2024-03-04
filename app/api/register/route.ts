import { db } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json();

    if (!name || !email || !password) {
      return new Response("Missing fields", { status: 400 });
    }

    const userExists = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return Response.json(newUser, { status: 201 });
  } catch (error) {
    console.log("[REGISTER] Error: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
