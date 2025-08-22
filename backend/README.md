# MAMS Backend (Node.js + Express + PostgreSQL)

## Quick Start
1. `cp .env.example .env` and edit DATABASE_URL + JWT_SECRET
2. `npm install`
3. Create DB and apply schema: `psql $DATABASE_URL -f ./db/schema.sql && psql $DATABASE_URL -f ./db/seed.sql`
4. `npm run dev`

## Roles
- Admin: full access
- BaseCommander: limited to their base; can assign / expend
- LogisticsOfficer: purchases + transfers; base-limited

## Endpoints (sample)
- `POST /api/auth/login` { username, password } -> { token, role, baseId }
- `GET  /api/master/bases`
- `GET  /api/master/equipment-types`
- `POST /api/purchases`
- `GET  /api/purchases`
- `POST /api/transfers`
- `GET  /api/transfers`
- `POST /api/assignments/assign`
- `POST /api/assignments/expend`
- `GET  /api/assignments`
- `GET  /api/dashboard/summary`
- `GET  /api/dashboard/net-movement-detail`

## RBAC
Enforced via JWT + role claims in `utils/auth.js` and route-level guards.

## API Logging
All requests are logged to `api_logs` by `utils/logging.js` middleware.
