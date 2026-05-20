from datetime import datetime, timedelta
import requests
import json
import os
import time
from typing import List, Dict, Any
from dotenv import load_dotenv, find_dotenv

# Load .env by searching parent directories (repo root)
dotenv_path = find_dotenv()
if dotenv_path:
    load_dotenv(dotenv_path)
else:
    load_dotenv()

GITHUB_ACCESS_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")
if not GITHUB_ACCESS_TOKEN:
    print("Warning: GITHUB_ACCESS_TOKEN not found — proceeding unauthenticated may hit rate limits.")
else:
    print("GITHUB_ACCESS_TOKEN found and will be used for authenticated requests.")

STARTER_KEYWORDS = ["starter", "boilerplate", "scaffold", "init", "template"]
STARTER_TOPICS = ["starter-kit", "boilerplate", "project-template"]

GRAPHQL_URL = "https://api.github.com/graphql"
GRAPHQL_QUERY = """
query($query: String!, $after: String, $first: Int!) {
    search(query: $query, type: REPOSITORY, first: $first, after: $after) {
        pageInfo {
            hasNextPage
            endCursor
        }
        edges {
            node {
                ... on Repository {
                    name
                    url
                    description
                    owner { login }
                    isTemplate
                    stargazerCount
                    forkCount
                    updatedAt
                    createdAt
                    repositoryTopics(first: 10) {
                        nodes { topic { name } }
                    }
                }
            }
        }
    }
}
"""


def fetch_page(query: str, after: str | None) -> tuple[list, str | None, bool]:
    """
    Fetch a single page of results. Returns (nodes, next_cursor, has_next_page).
    On any error, logs it and returns ([], None, False) so the caller can skip ahead.
    """
    headers = {"Content-Type": "application/json"}
    if GITHUB_ACCESS_TOKEN:
        headers["Authorization"] = f"bearer {GITHUB_ACCESS_TOKEN}"

    payload = {
        "query": GRAPHQL_QUERY,
        "variables": {"query": query, "after": after, "first": 25},
    }

    try:
        response = requests.post(GRAPHQL_URL, json=payload, headers=headers, timeout=20)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"  Page fetch failed, skipping: {e}")
        return [], None, False

    try:
        data = response.json()
    except Exception as e:
        print(f"  Failed to parse response JSON, skipping: {e}")
        return [], None, False

    if "errors" in data:
        print(f"  GraphQL errors, skipping page: {data['errors']}")
        return [], None, False

    try:
        search = data["data"]["search"]
        nodes = [edge["node"] for edge in search["edges"] if edge.get("node")]
        next_cursor = search["pageInfo"]["endCursor"]
        has_next = search["pageInfo"]["hasNextPage"]
        return nodes, next_cursor, has_next
    except Exception as e:
        print(f"  Unexpected response structure, skipping: {e}")
        return [], None, False


def search_github_templates(query: str, target: int = 500) -> List[Dict[str, Any]]:
    results = []
    seen_urls = set()
    after = None
    has_next = True
    page = 0

    while has_next and len(results) < target:
        page += 1
        print(f"Fetching page {page} (collected {len(results)} so far)...")

        nodes, after, has_next = fetch_page(query, after)

        for node in nodes:
            if not node.get("isTemplate"):
                continue
            url = node.get("url")
            if not url or url in seen_urls:
                continue
            seen_urls.add(url)
            results.append(node)
            if len(results) >= target:
                break

        # If the page errored out (after is None, has_next is False), stop — no cursor to advance.
        # This only happens on a hard failure; normal end-of-results also sets has_next=False.
        time.sleep(1.0)

    return results[:target]


def is_starter_template(repo: Dict[str, Any]) -> bool:
    name_desc = (repo["name"] + " " + (repo["description"] or "")).lower()
    if any(keyword in name_desc for keyword in STARTER_KEYWORDS):
        return True
    topics = [node["topic"]["name"] for node in repo["repositoryTopics"]["nodes"]]
    return any(topic in STARTER_TOPICS for topic in topics)


def process_templates() -> List[Dict[str, Any]]:
    query = " OR ".join(STARTER_KEYWORDS)
    repositories = search_github_templates(query, target=500)
    results = []
    for repo in repositories:
        if is_starter_template(repo):
            results.append({
                "name": repo["name"],
                "url": repo["url"],
                "description": repo["description"],
                "owner": repo["owner"]["login"],
                "stars": repo["stargazerCount"],
                "forks": repo["forkCount"],
                "created_at": repo["createdAt"],
                "updated_at": repo["updatedAt"],
                "topics": [node["topic"]["name"] for node in repo["repositoryTopics"]["nodes"]],
            })
            if len(results) >= 500:
                break
    return results


def rank_repositories(repos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    for repo in repos:
        score = (
            repo["stars"] * 2
            + repo["forks"]
            + len(repo["topics"]) * 5
        )
        last_update = datetime.fromisoformat(repo["updated_at"].rstrip("Z"))
        if datetime.now() - last_update <= timedelta(days=90):
            score *= 1.5
        repo["score"] = score
    return sorted(repos, key=lambda x: x["score"], reverse=True)


def calculate_average_stars(repos: List[Dict[str, Any]]) -> float:
    return sum(repo["stars"] for repo in repos) / len(repos) if repos else 0


if __name__ == "__main__":
    template_repos = process_templates()
    ranked_repos = rank_repositories(template_repos)
    avg_stars = calculate_average_stars(ranked_repos)

    print(f"\nFound {len(ranked_repos)} relevant starter template repositories")
    print(f"Average star count: {avg_stars:.2f}")

    json_file_path = os.path.join(os.path.dirname(__file__), "output", "github_starter_templates.json")
    os.makedirs(os.path.dirname(json_file_path), exist_ok=True)
    with open(json_file_path, "w") as f:
        json.dump(ranked_repos, f, indent=2)
    print("Results written to", json_file_path)

    print("\nTop 10 starter template repositories:")
    for repo in ranked_repos[:10]:
        print(f"{repo['name']} by {repo['owner']} - {repo['stars']} stars, {repo['forks']} forks")
        print(f"  URL: {repo['url']}")
        print(f"  Description: {repo['description']}")
        print(f"  Topics: {', '.join(repo['topics'])}")
        print(f"  Last updated: {repo['updated_at']}")
        print()