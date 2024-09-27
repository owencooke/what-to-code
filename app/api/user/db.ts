import { supabase, generateId } from "@/lib/db";
import { NewProject } from "@/types/project";
import axios from "axios";

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

async function getUsername(authHeader: string) {
  const url = "https://api.github.com/user";
  const response = await axios.get(url, {
    headers: {
      Authorization: authHeader,
      Accept: "application/vnd.github.v3+json",
    },
  });
  return response.data.login;
}

export { getMyProjects, getOtherProjects, getUsername };
