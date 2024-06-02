import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // ...add more providers here
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
