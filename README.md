# Life RPG — Backend

Backend API for a gamified habit-tracking app, built for Tech Zephyr 4.0 (IIT Bhubaneswar).

## Tech Stack
- Node.js + Express
- Supabase (Postgres + Auth)
- Hosted on Render

## Setup
1. Clone this repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill in real values from your Supabase project (Settings → API Keys)
4. `node server.js`
5. Server runs on `http://localhost:3000`

## Environment Variables
See `.env.example` — requires `SUPABASE_URL` and `SUPABASE_SECRET_KEY`.

## API Endpoints

### Auth
- `POST /auth/signup` — `{ email, password }` → creates account + character
- `POST /auth/login` — `{ email, password }` → returns `access_token`
- `GET /me` — (auth required) returns the logged-in user's id

### Tasks
- `POST /tasks` — (auth) `{ title, attribute, xp_value }` → creates a task
- `GET /tasks` — (auth) returns all of the user's tasks
- `PATCH /tasks/:id` — (auth) update a task; setting `completed: true` triggers XP, leveling, streak, and currency updates
- `DELETE /tasks/:id` — (auth) delete a task

### Character
- `GET /character` — (auth) returns level, XP, currency, streak, attributes

### Shop
- `GET /shop` — (auth) list purchasable items
- `POST /shop/buy` — (auth) `{ item_id }` → purchase with currency
- `GET /inventory` — (auth) list owned items with details

All protected routes require an `Authorization: Bearer <access_token>` header.

## Notes
- `/inventory` joins `inventory` and `shop_items` manually in code rather than via a database foreign key — kept simple intentionally for hackathon speed.
- Both a `profiles` row and a `characters` row are created on signup; `characters` is what's actually used for RPG stats — `profiles` is a minor leftover worth trimming later if time allows, not urgent.
- `/submit` and `/items` are leftovers from pre-hackathon practice, unrelated to the Life RPG app itself.