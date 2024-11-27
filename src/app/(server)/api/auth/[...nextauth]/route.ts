import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { getUser } from "@/app/(server)/integration/github/user";
import { createUserIfNotExist } from "@/app/(server)/db/query/user";
import { sendWelcomeEmail } from "@/app/(server)/integration/email/welcome";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string | null;
    } & DefaultSession["user"];
  }
}

const isProduction = process.env.NODE_ENV === "production";

const authOptions: NextAuthOptions = {
  cookies: {
    sessionToken: {
      name: isProduction
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
    callbackUrl: {
      name: isProduction
        ? "__Secure-next-auth.callback-url"
        : "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
    csrfToken: {
      name: isProduction
        ? "__Secure-next-auth.csrf-token"
        : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
  },
  session: {
    strategy: "jwt",
  },
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
        // This only runs on initial sign in
        token.sub = account.providerAccountId;
        token.accessToken = account.access_token;

        // Fetch GitHub username
        const { login: username } = await getUser(token.accessToken as string);
        token.username = username;

        // Check first-time user status only on initial sign in
        const { status } = await createUserIfNotExist(
          token.sub,
          username,
          token.email as string,
        );

        if (status === "created") {
          await sendWelcomeEmail(token.email as string, token.name as string);
        }
      }

      // For subsequent requests, just return the existing token
      return token;
    },
    async session({ session, token }) {
      // Pass relevant token data to session
      session.user.username = token.username as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
