# ============================================================================
# Dockerfile for the API Server (Render deployment)
# ============================================================================
# esbuild bundles all JS/TS dependencies into a single dist/index.mjs,
# so at runtime we only need Node.js to execute it.
# ============================================================================

FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# ---------- install (cached layer) -------------------------------------------
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY lib/db/package.json lib/db/
COPY lib/api-zod/package.json lib/api-zod/
COPY artifacts/api-server/package.json artifacts/api-server/

RUN pnpm install --frozen-lockfile

# ---------- build -------------------------------------------------------------
COPY lib/ lib/
COPY artifacts/api-server/ artifacts/api-server/
COPY tsconfig.base.json tsconfig.json ./

RUN pnpm --filter @workspace/api-server run build

# ---------- runtime -----------------------------------------------------------
# esbuild bundles everything; only runtime deps needed are native externals.
# We keep node_modules as-is to avoid pnpm workspace resolution issues.
RUN rm -rf lib artifacts/api-server/src artifacts/api-server/build.mjs \
    tsconfig.base.json tsconfig.json .npmrc

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
