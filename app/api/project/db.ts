import { supabase } from "@/lib/db";
import { Project } from "@/types/project";
import { nanoid } from "nanoid";
import { getUsername } from "./github";

async function createProject(
  project: Project,
  authHeader: string,
): Promise<string> {
  const id = nanoid();
  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        id,
        github_user: await getUsername(authHeader),
        ...project,
      },
    ])
    .single();

  if (error) {
    console.error("Error inserting project:", error);
    throw error;
  }

  return id;
}

async function getProject(projectId: string): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
  console.log(data);

  return data;
}

export { getProject, createProject };
