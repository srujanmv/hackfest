# URBAN INCIDENT REPORTER

Autonomous voice-agent civic infrastructure reporting platform with a hackathon-ready UI.

## Monorepo layout

- `frontend/` Next.js + Tailwind + Framer Motion + Recharts + Map (Mapbox-ready)
- `backend/` Express API + MongoDB (with in-memory fallback) + uploads + rate limiting

## Quickstart

### 1) Prereqs

- Node.js 20+ (recommended)
- Optional MongoDB connection string

### 2) Install

```bash
npm install
```

### 3) Configure env

Copy env examples and adjust:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

### 4) Run (two terminals)

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

## Notes

- The app works without external AI keys by using a deterministic fallback assistant.
- Add `OPENAI_API_KEY` in `backend/.env` to use the OpenAI Responses API for open-ended answers.
- Optional assistant model override: `OPENAI_MODEL=gpt-5-mini`.
