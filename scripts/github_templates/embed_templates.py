import json
import os
import time
import psycopg2
import psycopg2.extras
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# --- Config ---
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "gemini-embedding-2")
EMBEDDING_DIMS = int(os.getenv("EMBEDDING_DIMS", "1536"))  # must match DB vector column size
SLEEP_SEC = float(os.getenv("EMBEDDING_SLEEP_SEC", "0.65"))  # 100 req/min free tier

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
TEMPLATES_FILE = os.path.join(OUTPUT_DIR, "github_starter_templates_top75.json")
CACHE_FILE = os.path.join(OUTPUT_DIR, "embeddings_cache.json")


# --- Gemini embedding ---

def generate_embedding(text: str) -> list[float]:
    """Embed text using the Gemini embedding model."""
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    result = genai.embed_content(model=EMBEDDING_MODEL, content=text, output_dimensionality=EMBEDDING_DIMS)
    return result["embedding"]


def build_embedding_input(doc: dict) -> str:
    parts = [doc.get("name", ""), doc.get("description") or "", " ".join(doc.get("topics", []))]
    return " ".join(p for p in parts if p).strip()


# --- Postgres ---

def url_exists_in_db(cursor, url: str) -> bool:
    cursor.execute("SELECT 1 FROM templates WHERE url = %s LIMIT 1", (url,))
    return cursor.fetchone() is not None


def store_in_db(cursor, conn, url: str, embedding: list[float]):
    cursor.execute(
        "INSERT INTO templates (url, embedding) VALUES (%s, %s)",
        (url, psycopg2.extras.Json(embedding)),
    )
    conn.commit()


# --- Cache ---

def load_cache() -> dict:
    """Load existing url->embedding mappings from disk, or return empty dict."""
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE) as f:
            return json.load(f)
    return {}


def save_cache(cache: dict):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)


# --- Main pipeline ---

def process_templates():
    # Load templates
    with open(TEMPLATES_FILE) as f:
        docs = json.load(f)
    print(f"Loaded {len(docs)} templates from {TEMPLATES_FILE}")

    # Load embedding cache (url -> embedding)
    cache = load_cache()
    print(f"Cache has {len(cache)} existing embeddings")

    # Connect to Postgres
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
    )
    cursor = conn.cursor()

    processed = 0
    skipped = 0
    errors = 0

    for doc in docs:
        url = doc["url"]

        # Check DB first to avoid re-inserting on reruns
        if url_exists_in_db(cursor, url):
            skipped += 1
            continue

        # Use cached embedding if available, otherwise call Gemini
        if url in cache:
            embedding = cache[url]
        else:
            try:
                embedding = generate_embedding(build_embedding_input(doc))
                cache[url] = embedding
                save_cache(cache)  # persist after each new embedding
                time.sleep(SLEEP_SEC)
            except Exception as e:
                print(f"  Embedding failed for {url}: {e}")
                errors += 1
                continue

        try:
            store_in_db(cursor, conn, url, embedding)
            processed += 1
            print(f"  [{processed}] Stored: {doc['name']}")
        except Exception as e:
            print(f"  DB insert failed for {url}: {e}")
            conn.rollback()
            errors += 1

    cursor.close()
    conn.close()

    print(f"\nDone. Stored: {processed}, Skipped (already in DB): {skipped}, Errors: {errors}")
    print(f"Embedding cache saved to {CACHE_FILE}")


if __name__ == "__main__":
    process_templates()