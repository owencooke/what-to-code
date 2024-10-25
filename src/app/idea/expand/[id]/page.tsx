import { notFound } from "next/navigation";
import { PartialIdea, PartialIdeaSchema } from "@/types/idea";
import IdeaClient from "./ExpandIdea";
import { getIdeaById } from "@/lib/db/query/idea";

export default async function IdeaPage({ params }: { params: { id: number } }) {
  const idea = await getIdeaById(params.id);

  return <IdeaClient idea={idea} />;
}
