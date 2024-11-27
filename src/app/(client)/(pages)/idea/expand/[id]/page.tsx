"use server";

import IdeaClient from "./ExpandIdea";
import { getIdeaById } from "@/app/(server)/db/query/idea";

export default async function IdeaPage({ params }: { params: { id: number } }) {
  const idea = await getIdeaById(params.id);

  return <IdeaClient idea={idea} />;
}
