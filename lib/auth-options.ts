import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { db } from "./prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {
          email: "",
          password: "",
        };

        const user = await db.user.findFirst({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcryptjs.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      const user = await db.user.findFirst({
        where: {
          id: token.sub,
        },
      });

      token.name = user?.name;
      token.username = user?.username;
      token.email = user?.email;
      token.picture = user?.profilePicture;
      token.bio = user?.bio;
      token.contactEmail = user?.contactEmail;
      token.subscribers = user?.subscribers;

      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.id = token.sub;
      session.user?.name === token.name;
      // @ts-ignore
      session.user.username = token.username;
      session.user?.email === token.email;
      session.user?.image === token.picture;
      // @ts-ignore
      session.user.bio = token.bio;
      // @ts-ignore
      session.user.contactEmail = token.contactEmail;
      // @ts-ignore
      session.user.subscribers = token.subscribers;

      return session;
    },
  },
};
