# [what to code](https://www.what-to-code.dev/)
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

## Dev Documentation

### Project Structure
```
scripts/
├── github_templates                # Python scripts for scraping/embedding GitHub template repos for matching
src/
├── app/
│   └── api/                        # API: Backend routes (keep as simple as possible, just define route. Define DB/GitHub/other logic under `src/lib`)
│   │   └── templates/
│   │       └── route.ts
│   └── page.tsx                    # Non-API folders: React routes, to be rendered at specific route according to dir path
├── components/
│   └── ui/                         # ShadCN components automatically added under here using CLI (don't usually need to edit)
│   │   └── shadcn-component.tsx  
│   │
│   └── our-custom-component.tsx    # Custom reusable React components for our app
├── lib/
│   ├── db/                         # Keep DB/query logic here (ex: creating a new Project)
│   │   ├── config.ts
│   │   ├── schema.ts                   # Source of truth for project's DB tables (via Drizzle models)
│   │   └── query/                  
│   │       └── project.ts          
│   ├── github/                     # Keep GitHub API integration calls here (ex: creating repos, issues, etc.)
│   │   └── user.ts                 
│   └── llm/                        # LLM configs (ex: OpenAI, Google) and helper functions (ex: structured JSON output from prompts)
│       ├── config.ts               
│       └── utils.ts               
├── types/                          # TypeScript type definitions and Zod schemas (ex: Idea, Project, ...)
    └── index.ts                    
```

### Managing DB via Drizzle and Supabase
The source of truth for the project's DB schema is defined using Drizzle in `src/lib/db/schema.ts`. 

Updates to the DB schema can be made by modifying the TS definitions in this file and running the following commands:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```
See [Drizzle docs](https://orm.drizzle.team/docs/migrations#:~:text=email%60%20TEXT%20UNIQUE%3B-,Option%203,-I%20want%20to) for more info about schema migration.

**Important Notes:**
- Do **NOT** update the tables directly in Supabase. There is a known bug with Drizzle that can cause errors when trying to sync the schemas if Supabase manages the tables, foreign keys, etc.
- For proper foreign key relationships to be applied, make sure to define them using the `relations` TS function, not just in the TS table definition:
```typescript
// Define the relations
export const projectRelations = relations(projects, ({ one }) => ({
  owner: one(users, {
    fields: [projects.owner_id],
    references: [users.id],
  }),
}));
```
