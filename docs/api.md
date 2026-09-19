# API (roadmap contract)

The frontend consumes a typed data layer (`src/lib/data`) whose shapes mirror the intended REST API.
When the FastAPI backend is added, these endpoints back the same shapes:

```
GET  /api/minerals            GET /api/minerals/{id}
GET  /api/technologies        GET /api/technologies/{id}
GET  /api/patents             GET /api/patents/{id}
GET  /api/rd                  GET /api/rd/{id}
GET  /api/organisations       GET /api/organisations/{id}
GET  /api/search?q=
GET  /api/trends
GET  /api/emerging
GET  /api/gaps                GET /api/gaps/{id}
GET  /api/collaboration
GET  /api/graph
GET  /api/evidence            GET /api/evidence/{id}
POST /api/alerts
POST /api/briefs
```

## Search architecture (roadmap)
Hybrid: keyword + full-text + vector (pgvector) + metadata filtering. Ranking blends relevance,
mineral/technology match, evidence confidence and recency. The prototype implements a deterministic
in-memory `search()` over the demo dataset with the same result shape (`SearchResult`).

## Conventions
Validate all input (Pydantic server-side; typed forms client-side). Every record returns its provenance
envelope. Never return a source as live unless a real connector produced it.
