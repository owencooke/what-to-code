import { getRandomURLFriendlyId } from "@/lib/db/utils";
import { supabase } from "@/lib/db/config";
import { NewProject } from "@/types/project";

async function createProject(project: NewProject): Promise<string> {
  const id = getRandomURLFriendlyId();
  // Omit certain fields from DB
  const { starterRepo, ...projectData } = project;

  const { error } = await supabase
    .from("projects")
    .insert([
      {
        id,
        ...projectData,
      },
    ])
    .single();

  if (error) {
    console.error("Error inserting project to Supabase:", error);
    throw error;
  }

  return id;
}

async function getProject(projectId: string): Promise<NewProject> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    throw error;
  }

  return data;
}

const searchProjects = async (searchTerm: string) => {
  let query = supabase.from("random_projects").select("*");

  if (searchTerm) {
    query = query.or(
      `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error searching for projects:", error);
    throw error;
  }
  return data;
};

export { getProject, createProject, searchProjects };
