![Screenshot (739)](https://github.com/user-attachments/assets/54a9a7e9-4bfa-4e69-b223-ea1b42894736)

## Installation

### Prerequisites

- Node.js v20.17.0
- NPM

Install pnpm for faster dependency management

```bash
npm install --global pnpm
```

Install all Node modules

```bash
pnpm i
```

See `.env.dev` for the necessary environment variable template.

### Running

```bash
pnpm dev
```

## Project Structure
```
scripts/
├── github_templates                # Python scripts for scraping/embedding GitHub template repos for matching
src/
├── app/
│   └── api/                        # API: Backend routes (keep as simple as possible, just define route. Define DB/GitHub/other logic under `src/lib`)
│   │   └── templates/
│   │       └── route.ts
│   └── page.tsx                     # OTHER: React routes, to be rendered at specific route according to dir path
├── components/
│   └── ui/                         # ShadCN components automatically added under here using CLI (don't usually need to edit)
│   │   └── shadcn-component.tsx  
│   │
│   └── our-custom-component.tsx    # Custom reusable React components for our app
├── lib/
│   ├── db/                         # Keep DB/query logic here (ex: creating a new Project)
│   │   ├── config.ts               
│   │   └── query/                  
│   │       └── project.ts          
│   ├── github/                     # Keep GitHub API integration calls here (ex: creating repos, issues, etc.)
│   │   └── user.ts                 
│   └── llm/                        # Keep LLM config (ex: OpenAI, Google) and helpers (ex: structured JSON output from prompts) here
│       ├── config.ts               
│       └── utils.ts               
├── types/                          # TypeScript type definitions and Zod schemas (ex: Idea, Project, ...)
    └── index.ts                    
```
