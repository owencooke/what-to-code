import { supabase } from "@/lib/db/config";
import { NewProject } from "@/types/project";

async function getMyProjects(userId: string): Promise<NewProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("github_user", userId);

  if (error) {
    console.error(`Error fetching projects for ${userId}:`, error);
    throw error;
  }
  console.log(data);

  return data;
}

async function getOtherProjects(userId: string): Promise<NewProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .neq("github_user", userId);

  if (error) {
    console.error(`Error fetching other projects for ${userId}:`, error);
    throw error;
  }
  console.log(data);

  return data;
}

export { getMyProjects, getOtherProjects };
