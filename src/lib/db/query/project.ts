import { supabase } from "@/lib/db/config";
import { NewProject, Project, ProjectSchema } from "@/types/project";

/**
 * Creates a new project in the database.
 *
 * @param {NewProject} project - The project data to insert.
 * @returns {Promise<string>} - A promise that resolves to the ID of the newly created project.
 * @throws {Error} - Throws an error if the insertion fails.
 */
async function createProject(project: NewProject): Promise<string> {
  // Omit certain fields from DB
  const { starterRepo, github_user, ...projectData } = project;

  // Fetch the user ID from the users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("username", github_user)
    .single();

  if (userError) {
    console.error("Error fetching user ID:", userError);
    throw userError;
  }

  const owner_id = userData.id;

  // Create the new project for user
  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...projectData, owner_id }])
    .select("id")
    .single();

  if (error) {
    console.error("Error inserting project to Supabase:", error);
    throw error;
  }

  return data.id;
}

/**
 * Fetches a project by its ID, including the GitHub user information.
 *
 * @param {string} projectId - The ID of the project to fetch.
 * @returns {Promise<Project>} - A promise that resolves to the project data.
 * @throws {Error} - Throws an error if the fetch fails.
 */
async function getProjectById(projectId: string): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
        users!inner (
            username
        )
    `,
    )
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    throw error;
  }

  // Parse the data to Project type
  const project = ProjectSchema.parse({
    ...data,
    github_user: data.users.username,
  });
  return project;
}
/**
 * Searches for projects by title or description, including the GitHub user information.
 *
 * @param {string} searchTerm - The search term to use.
 * @returns {Promise<Project[]>} - A promise that resolves to an array of projects.
 * @throws {Error} - Throws an error if the search fails.
 */
const searchProjects = async (searchTerm: string): Promise<Project[]> => {
  let query = supabase.from("projects").select(
    `
        *,
        users!inner (
            username
        )
    `,
  );
  if (searchTerm) {
    query = query.or(
      `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`,
    );
  }
  const { data, error } = await query;

  if (error) {
    console.error("Error searching projects:", error);
    throw error;
  }
  // Map the data to Project type
  const projects = data.map((project) =>
    ProjectSchema.parse({
      ...project,
      github_user: project.users.username,
    }),
  );
  return projects;
};

export { createProject, getProjectById, searchProjects };
