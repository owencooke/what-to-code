import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import DashboardContent from "./content";
import { getProjectsByUserId } from "@/app/(server)/db/query/project";
import { nextAuthOptions } from "@/app/(server)/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(nextAuthOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // Fetch projects for the user
  const projects = await getProjectsByUserId(session.user.id);

  return <DashboardContent user={session.user} projects={projects} />;
}
