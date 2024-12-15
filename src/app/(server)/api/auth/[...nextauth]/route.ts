import NextAuth from "next-auth";
import { nextAuthOptions } from "@/app/(server)/integration/auth/config";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
