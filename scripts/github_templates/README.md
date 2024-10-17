# github_templates

This directory contains Python scripts used for collecting and embedding GitHub template repos, for use in the recommendation/matching service.

## Setup

```bash
# Create a virtual environment
python3 -m venv .venv

# Activate the virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Script Files

`template_repo_collector.py` -> collects a list of candidates for GitHub repo templates, outputted as a JSON file to the `scripts/output` directory

`embed_templates.py` -> takes the output JSON from `template_repo_collector.py` as input, converts the repo description to a vector embedding using OpenAI, and uploads to Supabase to be used for vector search when finding similar templates

## TODO:

- combine these scripts into a more robust pipeline
- evaluate efficiency of OpenAI embedding (do we even need embeddings for this?)
- modify repo ranking method (especially if we ever need Docker files)
