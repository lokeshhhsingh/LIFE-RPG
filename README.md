# Life RPG — Frontend

Next.js 14 (App Router) + TypeScript + Tailwind.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

App runs at http://localhost:3000.

## Folder structure

- `app/` — routes (App Router). Each folder = a URL segment.
- `components/` — reusable UI components. Logic-owner (this repo section)
  builds structure/state; styling is layered on by the UI/UX teammate.
- `lib/api/` — one file per resource (`auth.ts`, `tasks.ts`, ...), all
  routed through `client.ts`. Toggle `NEXT_PUBLIC_USE_MOCK_API` in `.env.local`
  to switch between mock data and the real backend.
- `lib/xp-engine.ts` — pure leveling/streak math, no side effects.
- `types/` — shared interfaces (`User`, `Task`, `Character`, `InventoryItem`)
  — this is the contract with the backend team. Keep it in sync with their
  actual schema.

## Environment variables

See `.env.example`.

## Notes

- Mock API mode (`NEXT_PUBLIC_USE_MOCK_API=true`) is scaffolding only — the
  brief disqualifies submissions relying on localStorage/mock-only data for
  primary persistence. Switch this to `false` and point
  `NEXT_PUBLIC_API_BASE_URL` at the real backend before submission.
