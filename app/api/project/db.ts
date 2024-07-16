import { supabase, generateId } from "@/lib/db";
import { Project } from "@/types/project";

async function createProject(project: Project): Promise<string> {
  const id = generateId();
  const { error } = await supabase
    .from("projects")
    .insert([
      {
        id,
        ...project,
      },
    ])
    .single();

  if (error) {
    console.error("Error inserting project to Supabase:", error);
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
