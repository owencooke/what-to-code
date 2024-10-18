import { getRandomURLFriendlyId } from "@/lib/db/utils";
import { supabase } from "@/lib/db/config";
import { NewProject, Project } from "@/types/project";

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

async function getProjectById(projectId: string): Promise<Project> {
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

// Currently searches for projects by title or description
// random_projects is a view, just ordered randomly to show different projects on the homepage
const searchProjects = async (searchTerm: string): Promise<Project[]> => {
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

async function getProjectsByUserId(
  userId: string,
  ownedByUser: boolean = true,
): Promise<Project[]> {
  const query = supabase.from("projects").select("*");

  if (ownedByUser) {
    query.eq("github_user", userId);
  } else {
    query.neq("github_user", userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching projects for ${userId}:`, error);
    throw error;
  }
  return data;
}

export { getProjectById, createProject, searchProjects, getProjectsByUserId };
