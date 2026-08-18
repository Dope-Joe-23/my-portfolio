# Dope-Joe-23 Portfolio

A health-tech-focused developer portfolio for showcasing clinical workflow products, automation tools, and selected web projects.

## Run & Operate

- `pnpm --filter @workspace/dope-joe-portfolio run dev` — run the portfolio preview
- `pnpm --filter @workspace/dope-joe-portfolio run typecheck` — typecheck the portfolio
- `pnpm --filter @workspace/dope-joe-portfolio run build` — build the portfolio for publishing

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/dope-joe-portfolio/src/App.tsx` — portfolio routes, project data, and page composition
- `artifacts/dope-joe-portfolio/src/index.css` — shared theme, typography, responsive layout, and motion
- `artifacts/dope-joe-portfolio/src/components/` — reusable UI primitives from the scaffold
- `attached_assets/` — uploaded project brief and future media assets

## Architecture decisions

- Phase 1 is intentionally frontend-only with local project content so the portfolio is immediately reviewable and publishable.
- Wouter provides route-aware home, listing, case study, customization, contact, and fallback pages without adding a heavier router.
- The customization screen is a functional preview of the future CMS surface; persistence and authentication belong to the next phase.
- External project links are kept as explicit content data so the case studies remain easy to update.

## Product

The site leads with Dutyschedula and carestudy-automator, then presents selected web and product work through filterable project cards and detailed case-study routes. It also includes an about page, contact flow, social links, and an admin-style customization preview.

## User preferences

- Keep the portfolio professional, calm, accessible, and centered on health-tech work.

## Gotchas

- `dutyschedula` (formerly nurse-roster) is now linked to its live demo at https://nurse-roster-peach.vercel.app/.
- The full authenticated CMS, media library, scheduling, audit log, and backup workflow are planned follow-up phases; the current customization page is a frontend preview.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
