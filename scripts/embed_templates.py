from openai import OpenAI
import supabase
import psycopg2
import json
from dotenv import load_dotenv
import os

load_dotenv()

# Set up OpenAI and Supabase credentials
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_client = supabase.create_client(supabase_url, supabase_key)

# PostgreSQL connection (using psycopg2 for pgvector support)
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
)
cursor = conn.cursor()


# Function to generate embeddings using OpenAI
def generate_embedding(text: str) -> list:
    response = client.embeddings.create(model=os.getenv("EMBEDDING_MODEL"), input=text)
    embedding = response.data[0].embedding
    return embedding


# Function to process a single document and store metadata + embeddings
def process_document(doc):
    # Extract metadata
    url = doc["url"]

    # Create embedding input by combining name, description, and topics
    embedding_input = f"{doc['name']} {doc['description']} {' '.join(doc['topics'])}"

    # Generate the embedding
    embedding = generate_embedding(embedding_input)

    # Store the metadata and embedding in Supabase
    store_in_db(url, embedding)


# Function to store data in Supabase (in "templates" table)
def store_in_db(url: str, embedding: list):
    data = {"url": url, "embedding": embedding}
    supabase_client.table("templates").insert(data).execute()


def process_json_file(limit=10):
    json_file_path = os.path.join(
        os.path.dirname(__file__), "output", "github_starter_templates.json"
    )

    # Open the JSON file using the constructed path
    with open(json_file_path, "r") as file:
        data = json.load(file)

    # Process and store each GitHub template as embedding, limited by the value of limit
    last_processed_index = 0
    try:
        for i, doc in enumerate(data[:limit]):
            process_document(doc)
            last_processed_index = i + 1
    except Exception as e:
        print(f"Error processing document: {e}")
    finally:
        # Write the unprocessed data back to the JSON file
        unprocessed_data = data[last_processed_index:]
        with open(json_file_path, "w") as file:
            json.dump(unprocessed_data, file, indent=2)


# Run the pipeline
if __name__ == "__main__":
    process_json_file(100)

# Close the connection
cursor.close()
conn.close()
