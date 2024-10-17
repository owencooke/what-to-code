from datetime import datetime, timedelta
import requests
import json
import os
from typing import List, Dict, Any
from dotenv import load_dotenv

# Get GitHub personal access token from environment variable
load_dotenv()
GITHUB_ACCESS_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")
if not GITHUB_ACCESS_TOKEN:
    raise ValueError("GITHUB_ACCESS_TOKEN environment variable is not set")

# Keywords and topics related to project starters
STARTER_KEYWORDS = ["starter", "boilerplate", "scaffold", "init", "template"]
STARTER_TOPICS = ["starter-kit", "boilerplate", "project-template"]


def search_github_templates(query: str, max_results: int = 500) -> List[Dict[str, Any]]:
    url = "https://api.github.com/graphql"
    headers = {
        "Authorization": f"bearer {GITHUB_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    results = []
    has_next_page = True
    after = None

    while has_next_page and len(results) < max_results:
        print(f"Fetching more repositories...")
        graphql_query = {
            "query": """
            query($query: String!, $after: String) {
                search(query: $query, type: REPOSITORY, first: 100, after: $after) {
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
                                owner {
                                    login
                                }
                                isTemplate
                                stargazerCount
                                forkCount
                                updatedAt
                                createdAt
                                repositoryTopics(first: 10) {
                                    nodes {
                                        topic {
                                            name
                                        }
                                    }
                                }
                                object(expression: "HEAD:README.md") {
                                    ... on Blob {
                                        text
                                    }
                                }
                            }
                        }
                    }
                }
            }
            """,
            "variables": {"query": query, "after": after},
        }

        try:
            response = requests.post(url, json=graphql_query, headers=headers)
            response.raise_for_status()
            data = response.json()["data"]["search"]
            # Only collect template repositories
            # (o/w logic would need to be added to handle regular repositories during repo creation)
            repositories = [
                edge["node"] for edge in data["edges"] if edge["node"]["isTemplate"]
            ]
            results.extend(repositories)
            has_next_page = data["pageInfo"]["hasNextPage"]
            after = data["pageInfo"]["endCursor"]
            print(f"Fetched {len(results)} repositories so far...")
        except requests.RequestException as error:
            print(f"Fetch error: {error}")
            break

    return results[:max_results]


def is_starter_template(repo: Dict[str, Any]) -> bool:
    # Check if any starter keyword is in the name or description
    name_desc = (repo["name"] + " " + (repo["description"] or "")).lower()
    if any(keyword in name_desc for keyword in STARTER_KEYWORDS):
        return True

    # Check if any starter topic is present
    topics = [node["topic"]["name"] for node in repo["repositoryTopics"]["nodes"]]
    if any(topic in STARTER_TOPICS for topic in topics):
        return True
    return False


def process_templates() -> List[Dict[str, Any]]:
    query = " OR ".join(STARTER_KEYWORDS)
    repositories = search_github_templates(query)
    results = []

    for repo in repositories:
        if is_starter_template(repo):
            results.append(
                {
                    "name": repo["name"],
                    "url": repo["url"],
                    "description": repo["description"],
                    "owner": repo["owner"]["login"],
                    "stars": repo["stargazerCount"],
                    "forks": repo["forkCount"],
                    "created_at": repo["createdAt"],
                    "updated_at": repo["updatedAt"],
                    "topics": [
                        node["topic"]["name"]
                        for node in repo["repositoryTopics"]["nodes"]
                    ],
                }
            )

    return results


def rank_repositories(repos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    for repo in repos:
        # Calculate a simple ranking score
        score = (
            repo["stars"] * 2  # Weight stars more heavily
            + repo["forks"]
            + len(repo["topics"]) * 5  # Good metadata is important
        )

        # Boost score for recently updated repositories
        last_update = datetime.fromisoformat(repo["updated_at"].rstrip("Z"))
        if datetime.now() - last_update <= timedelta(days=90):
            score *= 1.5

        repo["score"] = score

    return sorted(repos, key=lambda x: x["score"], reverse=True)


def calculate_average_stars(repos: List[Dict[str, Any]]) -> float:
    total_stars = sum(repo["stars"] for repo in repos)
    return total_stars / len(repos) if repos else 0


if __name__ == "__main__":
    template_repos = process_templates()
    ranked_repos = rank_repositories(template_repos)
    avg_stars = calculate_average_stars(ranked_repos)

    print(f"Found {len(ranked_repos)} relevant starter template repositories")
    print(f"Average star count: {avg_stars:.2f}")

    # Write results to JSON file
    json_file_path = os.path.join(
        os.path.dirname(__file__), "output", "github_starter_templates.json"
    )
    with open(json_file_path, "w") as f:
        json.dump(ranked_repos, f, indent=2)
    print("Results written to", json_file_path)

    # Print top 10 repositories
    print("\nTop 10 starter template repositories:")
    for repo in ranked_repos[:10]:
        print(
            f"{repo['name']} by {repo['owner']} - {repo['stars']} stars, {repo['forks']} forks"
        )
        print(f"  URL: {repo['url']}")
        print(f"  Description: {repo['description']}")
        print(f"  Topics: {', '.join(repo['topics'])}")
        print(f"  Last updated: {repo['updated_at']}")
        print()
