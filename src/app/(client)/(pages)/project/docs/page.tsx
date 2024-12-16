import { Suspense } from "react";
import DocsGenerator from "./DocsGenerator";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/(server)/integration/auth/config";
import { redirect } from "next/navigation";
import { getProjectsByUserId } from "@/app/(server)/db/query/project";

export default async function Page() {
  const session = await getServerSession(nextAuthOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const projects = await getProjectsByUserId(session.user.id);

  return <DocsGenerator projects={projects} />;
}
