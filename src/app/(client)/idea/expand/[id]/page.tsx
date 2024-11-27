import IdeaClient from "./ExpandIdea";
import { getIdeaById } from "@/app/(server)/lib/db/query/idea";

export default async function IdeaPage({ params }: { params: { id: number } }) {
  const idea = await getIdeaById(params.id);

  return <IdeaClient idea={idea} />;
}