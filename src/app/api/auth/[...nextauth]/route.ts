import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { getUser } from "@/lib/github/user";
import { createUserIfNotExist } from "@/lib/db/query/user";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string | null;
    } & DefaultSession["user"];
  }
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: "repo user:email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Add the GitHub user's ID and access token to the token
        token.sub = account.providerAccountId;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Fetch GitHub username and include in user session info
      const { login: username } = await getUser(token.accessToken as string);
      session.user = { ...session.user, username };

      // If first-time user, create a new user in the DB
      await createUserIfNotExist(
        token.sub as string,
        username,
        session.user.email as string,
      );

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
