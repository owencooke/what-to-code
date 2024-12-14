import { DefaultSession } from "next-auth";

export interface UserSession extends DefaultSession {
  user: {
    id: string;
    username: string;
  } & DefaultSession["user"];
}
