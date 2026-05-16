# Meal Planner — Local Setup

## Requirements
- Node.js 18+
- pnpm 9+  (install with: npm install -g pnpm)

## Setup

1. Install dependencies:
   pnpm install

2. Generate API client code from the OpenAPI spec:
   pnpm --filter @workspace/api-spec run codegen

3. Start the API server (runs on port 5000 by default):
   PORT=5000 pnpm --filter @workspace/api-server run dev

4. In a separate terminal, start the frontend (runs on port 5173 by default):
   PORT=5173 pnpm --filter @workspace/recipe-finder run dev

5. Open http://localhost:5173 in your browser.

## Notes
- The recipe database is a CSV file at:
    artifacts/api-server/src/data/recipes.csv
  You can add more recipes there following the same column format.

- The API server base path is /api — all routes are prefixed with that.

- Environment variables:
    PORT — the port for each server (each needs its own)
    No database required — recipes load from the CSV file.

## Troubleshooting
- If codegen fails, ensure the OpenAPI spec at lib/api-spec/openapi.yaml is valid.
- If the frontend cannot reach the API, check that the API server is running and
  the Vite proxy in vite.config.ts is forwarding /api correctly.
