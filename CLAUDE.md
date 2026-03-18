# agent-json.org

Schema reference and validator for the agent.json file format. Next.js 16 + Tailwind CSS 4.

## Ecosystem

| Repo | Role |
|------|------|
| spec | Source of truth — the specification |
| agentwebprotocol.org | Standards website |
| **agent-json.org** (this repo) | Schema reference and validator |
| agent.json | npm CLI (`npx agent-json init`) |
| mcp-server | MCP server for Claude Code |

GitHub org: github.com/agentwebprotocol

## Pages

- `/` — Home page (hero, quick start, features)
- `/schema` — Full JSON schema display
- `/validate` — Client-side agent.json validator
- `/examples` — 3 curated examples (Airline, E-commerce, SaaS)

## API Routes

- `/api/validate` — POST, validates agent.json against schema
- `/api/schema` — GET, returns JSON schema definition
- `/api/examples` — GET, returns example array
- `/api/status` — GET, health check (operational + timestamp)

## Key Source Files

- `src/lib/schema.ts` — JSON Schema definition + TypeScript interfaces
- `src/lib/examples.ts` — 3 curated examples (Airline, E-commerce, SaaS)
- `public/agent.json` — This site's own agent.json (spec-compliant)

## Build & Deploy

```bash
npm run dev    # local dev
npm run build  # production build
```

## When Spec Changes

If spec fields change, update:
1. `src/lib/schema.ts` — the JSON schema definition
2. `src/lib/examples.ts` — examples if new fields are relevant
3. `public/agent.json` — this site's own agent.json
