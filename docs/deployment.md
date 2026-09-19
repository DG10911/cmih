# Deployment

## Local
```bash
npm install && npm run dev      # http://localhost:3000
npm run build && npm run start  # production
```

## Docker
```bash
docker compose up --build       # http://localhost:3000
```
`next.config.mjs` sets `output: "standalone"`; the multi-stage `Dockerfile` produces a lean runtime
image (non-root `nextjs` user). `docker-compose.yml` runs the web app and declares commented
`postgres`/`redis` services for the production roadmap. Config is via env vars — see `.env.example`
(the frontend prototype needs none). A container health check probes `/`.

## GitHub Pages (live demo)
The app is fully static-exportable (every route is Static/SSG). `next.config.mjs` emits a static
export to `out/` by default, under the `/cmih` base path when `GITHUB_PAGES=true`.
`.github/workflows/deploy-pages.yml` builds and publishes `out/` to Pages on every push to `main`,
serving https://DG10911.github.io/cmih/. Build the export locally with:
```bash
GITHUB_PAGES=true npm run build   # → ./out
```

## Government deployment readiness
Containerised and env-driven, compatible with government-controlled hosting. Roadmap adds the FastAPI
backend, PostgreSQL + pgvector, Redis, ingestion workers, authorised source connectors, authn/authz
enforcement and audit logging.
