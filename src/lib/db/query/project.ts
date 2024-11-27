import { db } from "@/lib/db/config";
import { projects, users } from "@/lib/db/schema";
import { NewProject, Project, ProjectSchema } from "@/types/project";
import { eq, ilike, or, not, getTableColumns, and } from "drizzle-orm";

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
  const [userData] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, github_user));

  if (!userData) {
    const error = new Error("Error fetching user ID");
    console.error(error);
    throw error;
  }

  const owner_id = userData.id;

  // Insert the project with the owner_id
  const [insertedProject] = await db
    .insert(projects)
    .values({ ...projectData, owner_id })
    .returning({ id: projects.id });

  if (!insertedProject) {
    const error = new Error("Error inserting project");
    console.error(error);
    throw error;
  }

  return insertedProject.id;
}

/**
 * Fetches a project by its ID, including the GitHub user information.
 *
 * @param {string} projectId - The ID of the project to fetch.
 * @returns {Promise<Project>} - A promise that resolves to the project data.
 * @throws {Error} - Throws an error if the fetch fails.
 */
async function getProjectById(projectId: string): Promise<Project> {
  const [project] = await db
    .select({
      ...getTableColumns(projects),
      github_user: users.username,
    })
    .from(projects)
    .leftJoin(users, eq(users.id, projects.owner_id))
    .where(eq(projects.id, projectId));

  if (!project) {
    throw new Error("Error fetching project");
  }

  return parseProjectData(project);
}

/**
 * Searches for projects by title or description, including the GitHub user information.
 *
 * @param {string | undefined} searchTerm - The search term to use.
 * @param {string | string[] | undefined} tags - The optional tags to filter projects by.
 * @returns {Promise<Project[]>} - A promise that resolves to an array of projects.
 * @throws {Error} - Throws an error if the search fails.
 */
async function searchProjects(
  searchTerm: string | undefined,
  tags: string | string[] | undefined,
): Promise<Project[]> {
  const conditions = [];

  // Add search query conditions
  if (searchTerm) {
    conditions.push(
      or(
        ilike(projects.title, `%${searchTerm}%`),
        ilike(projects.description, `%${searchTerm}%`),
      ),
    );
  }

  // Add tags conditions
  if (tags) {
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    conditions.push(
      or(
        ...tags.map((topic) =>
          or(
            ilike(projects.title, `%${topic}%`),
            ilike(projects.description, `%${topic}%`),
          ),
        ),
      ),
    );
  }

  // Build the final query with all conditions
  const projectsList = await db
    .select({
      ...getTableColumns(projects),
      github_user: users.username,
    })
    .from(projects)
    .leftJoin(users, eq(users.id, projects.owner_id))
    .where(and(...conditions));

  if (!projectsList) {
    throw new Error("Error searching projects");
  }

  return projectsList.map(parseProjectData);
}

/**
 * Fetches projects by user ID, including the GitHub user information.
 *
 * @param {string} userId - The ID of the user.
 * @param {boolean} [ownedByUser=true] - Whether to fetch projects owned by the user or not.
 * @returns {Promise<Project[]>} - A promise that resolves to an array of projects.
 * @throws {Error} - Throws an error if the fetch fails.
 */
async function getProjectsByUserId(
  userId: string,
  ownedByUser: boolean = true,
): Promise<Project[]> {
  let query = db
    .select({
      ...getTableColumns(projects),
      github_user: users.username,
    })
    .from(projects)
    .leftJoin(users, eq(users.id, projects.owner_id));

  if (ownedByUser) {
    query.where(eq(projects.owner_id, userId));
  } else {
    query.where(not(eq(projects.owner_id, userId)));
  }

  const projectsList = await query;

  if (!projectsList) {
    throw new Error(`Error fetching projects for ${userId}`);
  }

  return projectsList.map(parseProjectData);
}

/**
 * Helper function to parse DB data according to the ProjectSchema.
 *
 * @param {any} project - The project data to parse.
 * @returns {Project} - The project as a parsed Zod schema.
 * @throws {Error} - Throws an error if the parsing fails.
 */
function parseProjectData(project: any): Project {
  return ProjectSchema.parse(project);
}

export { createProject, getProjectById, searchProjects, getProjectsByUserId };
