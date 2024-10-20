import os
import requests
import psycopg2
from psycopg2.extras import Json
from supabase import create_client, Client

# Ensure environment variables are set
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")

if not SUPABASE_URL or not SUPABASE_KEY or not GITHUB_TOKEN:
    raise ValueError(
        "Environment variables SUPABASE_URL, SUPABASE_KEY, GITHUB_TOKEN must be set"
    )

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Connect to PostgreSQL database
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
)
cur = conn.cursor()

# Create the new projects2 table
cur.execute(
    """
CREATE TABLE IF NOT EXISTS projects2 (
  id varchar(21) PRIMARY KEY DEFAULT generate_url_friendly_id (),
  title varchar(100) NOT NULL,
  description varchar(350) NOT NULL,
  features jsonb,
  framework jsonb,
  owner_id varchar(21) REFERENCES users(id),
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);
"""
)
conn.commit()

# Fetch all records from the projects table
cur.execute("SELECT * FROM projects")
projects = cur.fetchall()


# Function to fetch email from GitHub API
def fetch_github_email(username):
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }
    response = requests.get(f"https://api.github.com/users/{username}", headers=headers)
    response.raise_for_status()
    user_data = response.json()
    return user_data.get("email")


# Function to create user if not exists and return user ID
def create_user_if_not_exist(username, email):
    user_response = (
        supabase.table("users").select("id").eq("username", username).execute()
    )
    if user_response.data == []:
        new_user_response = (
            supabase.table("users")
            .insert({"username": username, "email": email})
            .execute()
        )
        return new_user_response.data[0]["id"]
    return user_response.data[0]["id"]


# Migrate data from projects to projects2
for project in projects:
    project_id, title, description, features, framework, github_user, created_at = (
        project
    )
    email = fetch_github_email(github_user)
    owner_id = create_user_if_not_exist(github_user, email)
    cur.execute(
        """
    INSERT INTO projects2 (id, title, description, features, framework, owner_id, created_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """,
        (
            project_id,
            title,
            description,
            Json(features),
            Json(framework),
            owner_id,
            created_at,
        ),
    )
    conn.commit()

# Close the database connection
cur.close()
conn.close()
