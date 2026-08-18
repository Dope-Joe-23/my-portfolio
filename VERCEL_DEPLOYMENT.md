# Vercel Deployment Guide

## Overview
This guide covers deploying both the frontend (dope-joe-portfolio) and backend (api-server) to Vercel.

## Prerequisites
- ✅ Vercel CLI installed: `npm install -g vercel`
- ✅ Vercel account created at vercel.com
- ✅ GitHub repository connected to Vercel

## Deployment Strategy

### Option 1: Separate Vercel Projects (Recommended)
Deploy frontend and API as two separate Vercel projects for better scalability and independent deployments.

**Frontend Project (dope-joe-portfolio)**

1. Deploy from root directory:
```bash
cd c:\Users\josep\Desktop\my-portfolio
vercel --prod
```

When prompted:
- Project name: `dope-joe-portfolio`
- Project directory: `.`
- Build command: `pnpm -F @workspace/dope-joe-portfolio run build`
- Output directory: `artifacts/dope-joe-portfolio/dist/public`
- Install command: `pnpm install`

2. Set environment variable in Vercel Dashboard:
   - `BASE_PATH` = `/`
   - `VITE_API_URL` = `https://your-api-project.vercel.app` (set after API is deployed)

**API Server Project (api-server)**

1. From the root directory, create a separate Vercel project:
```bash
cd c:\Users\josep\Desktop\my-portfolio\artifacts\api-server
vercel --prod --name dope-joe-portfolio-api
```

When prompted:
- Project name: `dope-joe-portfolio-api`
- Project directory: `.`
- Build command: `pnpm -F @workspace/api-server run build`
- Output directory: `dist`
- Install command: `pnpm install` (from root, not this directory)

⚠️ **Important**: The build needs to run from the workspace root, not from the api-server directory. You may need to manually update the build settings in Vercel Dashboard after initial deployment.

2. Set environment variables in Vercel Dashboard:
   - `PORT` = `8080`
   - `NODE_ENV` = `production`
   - Any other required env vars (DATABASE_URL, etc.)

### Option 2: Monorepo Deployment
Deploy both from a single Vercel project with rewrites.

Not recommended for this architecture as API needs to be independently scalable.

## Post-Deployment

1. **Update API URL in Frontend**
   - After API is deployed, update the frontend's environment variable:
   - `VITE_API_URL` = `https://dope-joe-portfolio-api.vercel.app`

2. **Test the Deployment**
   - Visit your portfolio: `https://dope-joe-portfolio.vercel.app`
   - Check API connectivity by visiting: `https://dope-joe-portfolio-api.vercel.app/api/healthz`

3. **Configure GitHub Integration**
   - Both projects should auto-sync with GitHub
   - Any push to main branch will trigger deployments

## Troubleshooting

### Build fails with "pnpm not found"
- Vercel might not have pnpm pre-installed
- Go to Vercel Dashboard → Project Settings → Build & Deploy → Override
- Add build command: `npm install -g pnpm && pnpm install && pnpm -F @workspace/dope-joe-portfolio run build`

### API calls fail in production
- Check CORS settings in api-server/src/app.ts
- Update CORS to allow your frontend domain:
```typescript
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})
```

### Environment variables not working
- Make sure they're set in Vercel Dashboard (not in .env files)
- Redeploy after setting variables

## Commands

```bash
# Login to Vercel
vercel login

# Deploy frontend
cd c:\Users\josep\Desktop\my-portfolio
vercel --prod

# Deploy API
cd c:\Users\josep\Desktop\my-portfolio\artifacts\api-server
vercel --prod --name dope-joe-portfolio-api

# View project status
vercel status

# Remove a project
vercel remove dope-joe-portfolio
```

## Environment Variables Needed

### Frontend (.env.production)
- `VITE_API_URL` - Base URL for API calls

### Backend (.env.production)
- `NODE_ENV` - `production`
- `PORT` - `8080` (or as configured)
- `DATABASE_URL` - PostgreSQL connection string (if needed)
- Any other service credentials

## Notes
- The portfolio is a static SPA and will be served from Vercel's Edge Network (fast!)
- The API runs on Node.js serverless functions (scales automatically)
- Both have automatic deployments on git push to main branch
