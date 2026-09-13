# Life RPG — Frontend

Next.js 14 (App Router) + TypeScript + Tailwind CSS.

**Live app:** https://life-rpg-puce.vercel.app
**Live backend API:** https://life-rpg-backend-apnq.onrender.com (Render free tier — first request after idle can take up to ~50 seconds)

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and set the backend URL:

```
NEXT_PUBLIC_API_BASE_URL=https://life-rpg-backend-apnq.onrender.com
```

(Use `http://localhost:3000` — or wherever it runs — if you have the backend running locally instead.)

```bash
npm run dev
```

App runs at http://localhost:3000.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL of the backend API. Defaults to `http://localhost:3000` if unset (see `lib/api/client.ts`). |

When deploying to Vercel, this must be set explicitly in the project's Environment Variables settings (or via `vercel env add`) — it is **not** picked up automatically from `.env.local`.

## Folder structure

```
app/
  page.tsx                landing page (public, SEO-optimized)
  robots.ts                generates /robots.txt (blocks /dashboard, /shop)
  sitemap.ts                generates /sitemap.xml (public routes only)
  icon.tsx                  generates the favicon
  login/, signup/           public auth pages
  dashboard/                protected — quest log + character panel
  shop/                     protected — shop + inventory
  layout.tsx                root layout: fonts, global metadata, AuthProvider
  globals.css               Tailwind directives + base styles

components/
  AuthCard.tsx              shared centered-card wrapper for login/signup
  CharacterPanel.tsx        level/XP bar/streak/attribute bars
  AttributeBar.tsx          reusable stat bar (used on landing page + dashboard)
  CreateTaskForm.tsx, TaskList.tsx, LevelUpCelebration.tsx
  ShopList.tsx
  ProtectedRoute.tsx, AuthListener.tsx
  landing/QuestBoardPreview.tsx   static demo card for the landing hero

lib/
  xp-engine.ts              pure XP/leveling math, no side effects
  auth/AuthContext.tsx       login/signup/logout, useAuth() hook
  api/                       one file per backend resource (auth, tasks,
                              shop, character), all routed through client.ts
  hooks/                     useTasks, useShop, useCharacter

types/index.ts               shared interfaces — kept in sync with the
                              backend's API contract
```

## Design system

Visual direction: "quest board" — parchment/ink palette, not a generic SaaS look. Tokens live in `tailwind.config.ts`:

- **Colors:** `ink`, `parchment` / `parchment-light` / `parchment-line`, `gold` / `gold-bright`, and three attribute colors — `rust` (strength), `indigo` (intellect), `forest` (discipline). Unrecognized attribute keys fall back to `gold`.
- **Fonts:** Fraunces (display/headings) + Work Sans (body), loaded via `next/font/google` in `app/layout.tsx`.
- **Shape:** `rounded-card` (2px) instead of the default rounded-xl; cards use an offset hard-drop-shadow (`shadow-[6px_6px_0_0_#D8C79C]`) rather than a soft blur.

Keep new UI consistent with these tokens rather than introducing new colors/fonts.

## Deployment

Deployed via the Vercel CLI directly from this folder (not yet wired to GitHub auto-deploy):

```bash
vercel --prod
```

Requires `NEXT_PUBLIC_API_BASE_URL` to already be set in the Vercel project's environment variables (Production).

## Verified working

Signup/login/logout + session persistence, task CRUD with real XP/gold rewards, character panel (level/XP/streak/attributes), shop (stackable + one-time purchases, refresh-persisted), form validation on empty/whitespace-only task titles. Lighthouse on the live landing page: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
