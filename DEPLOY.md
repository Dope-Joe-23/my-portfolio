# Deployment Guide

## Architecture

| Service | Platform | Technology |
|---------|----------|------------|
| **Frontend** (Portfolio) | Vercel | Vite + React SPA (static) |
| **Backend** (API Server) | Render | Express 5 + esbuild (Docker) |
| **Database** | Turso / SQLite | libsql via Drizzle ORM |

---

## 1. Backend — Render (Docker)

### Setup

1. **Push this repo to GitHub** (if not already).

2. **Create a new Render service:**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click **New → Web Service**
   - Connect your GitHub repo
   - Configure:
     - **Runtime:** Docker
     - **Dockerfile Path:** `artifacts/api-server/Dockerfile`
     - **Docker Context:** `.` (repo root)
     - **Plan:** Free (or Starter for production)
     - **Branch:** `main`

3. **Set environment variables in Render dashboard:**

   | Key | Value | Notes |
   |-----|-------|-------|
   | `NODE_ENV` | `production` | |
   | `PORT` | `3000` | Render injects this, but set it explicitly |
   | `DATABASE_URL` | `libsql://your-db.turso.io` | Turso/SQLite connection URL |

4. **Health check URL:** `/api/healthz`

5. **Deploy:** Render auto-deploys on push to `main`.

### Local Docker Test

```bash
# Build the image
docker build -f artifacts/api-server/Dockerfile -t api-server .

# Run it
docker run -p 3000:3000 -e DATABASE_URL="file:data.db" api-server

# Test
curl http://localhost:3000/api/healthz
```

### Files

- `artifacts/api-server/Dockerfile` — Docker build instructions
- `artifacts/api-server/.dockerignore` — Files excluded from Docker context
- `render.yaml` — Render Blueprint (optional, for Infrastructure as Code)

---

## 2. Frontend — Vercel

### Setup

1. **Create a new Vercel project:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo
   - Configure:
     - **Framework Preset:** Other
     - **Root Directory:** `artifacts/dope-joe-portfolio`
     - **Build Command:** `cd ../.. && pnpm install --frozen-lockfile && pnpm run build`
     - **Output Directory:** `dist/public`
     - **Install Command:** `cd ../.. && pnpm install --frozen-lockfile`

2. **Set environment variables in Vercel dashboard:**

   | Key | Value | Notes |
   |-----|-------|-------|
   | `PORT` | `5173` | Vite dev server port (used by config, safe default) |
   | `BASE_PATH` | `/` | Set to `/sub-path` if deploying under a sub-path |

3. **Deploy:** Vercel auto-deploys on push to `main`.

### Files

- `artifacts/dope-joe-portfolio/vercel.json` — SPA routing + asset caching

### SPA Routing

The `vercel.json` rewrites all non-asset routes to `index.html` so Wouter handles client-side routing for:
- `/` — Home
- `/projects` — All projects
- `/projects/:slug` — Case study pages
- `/about` — About page
- `/contact` — Contact page

---

## 3. Database (Turso)

The API server uses `@libsql/client` (Drizzle ORM) which supports:

- **Turso (libSQL):** `libsql://your-db-name-your-org.turso.io?authToken=your-token`
- **Local SQLite:** `file:data.db`

### Setup with Turso

1. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
2. Login: `turso auth login`
3. Create DB: `turso db create portfolio-db`
4. Get URL: `turso db show portfolio-db --url`
5. Get token: `turso db tokens create portfolio-db`
6. Set `DATABASE_URL` in Render to: `libsql://portfolio-db-your-org.turso.io?authToken=your-token`

### Push Schema

```bash
pnpm --filter @workspace/db run push
```

---

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=3000
DATABASE_URL=libsql://...?authToken=...
```

### Frontend (Vercel)
```
PORT=5173
BASE_PATH=/
```

---

## Quick Commands

```bash
# Typecheck everything
pnpm run typecheck

# Build everything
pnpm run build

# Build only the API server
pnpm --filter @workspace/api-server run build

# Build only the frontend
pnpm --filter @workspace/dope-joe-portfolio run build

# Docker build test
docker build -f artifacts/api-server/Dockerfile -t api-server .
docker run -p 3000:3000 -e DATABASE_URL="file:data.db" api-server
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Docker build fails on `pnpm install` | Ensure `pnpm-lock.yaml` is committed and up to date |
| Vercel build fails with workspace errors | Verify Root Directory is set to `artifacts/dope-joe-portfolio` |
| API returns 500 on health check | Check Render logs; ensure `PORT` and `DATABASE_URL` are set |
| SPA routes 404 on refresh | Verify `vercel.json` rewrites are in place |
| `PORT` not set on Render | Render auto-injects PORT, but set it explicitly to 3000 |
