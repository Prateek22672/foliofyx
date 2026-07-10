# FolioFyx

**Describe it. Watch it become a website.**

FolioFyx is a no-code website and portfolio builder. It began as a free portfolio builder for students and developers, and has grown into a full AI website studio: describe a site in plain language and the AI builds it, refine it turn by turn in chat, polish it in a drag-and-drop Studio editor, then publish it — on a FolioFyx link or your own custom domain.

**Live at [foliofyx.in](https://foliofyx.in)**

## About us

FolioFyx exists because getting a genuinely good-looking website shouldn't require design skills, code, or a hosting bill. Students and early-career developers lose opportunities to bad portfolios every day — so we made "recruiter-ready in minutes" the bar. Everything in the product serves that: curated templates instead of blank canvases, AI that's grounded in real design knowledge instead of generic output, and publishing that's one click instead of a deployment pipeline. FolioFyx is built and maintained by Prateek.

## Ways to build

| Path | What it does |
|---|---|
| AI Chat Builder | Chat-to-create: describe the site, see a live preview, refine turn by turn, publish from the chat |
| Build with AI | One prompt → a full page from designer-built, industry-matched templates |
| Upload Resume | PDF/image resume → AI extracts your identity, skills, experience, and projects into a ready portfolio |
| From a Reference | Describe a site or upload a screenshot — the layout and palette are rebuilt as editable elements |
| Manual Studio | A drag-and-drop canvas editor with grid snapping, alignment guides, undo/redo, autosave, and per-element styling |

Plus: publishing with SEO-ready server-rendered pages, custom domain connection with guided DNS verification, template gallery, talent discovery page, and guided onboarding tours.

## How it works

This repo contains the frontend (`client/`) — React 19 + Vite + Tailwind + Framer Motion. The backend lives in [Prateek22672/foliofyx-backend](https://github.com/Prateek22672/foliofyx-backend) — Node/Express + MongoDB + Python, with a RAG design engine (BM25 over a curated design-knowledge corpus with diversified retrieval) and a multi-key Groq LLM pool (Llama 3.3 70B with automatic rotation and fallback) so generation stays fast under load.

```
client/                  React app (this repo)
  src/pages/AIBuilder/     Chat-to-create builder with live preview
  src/pages/ReferenceStudio/  Design-from-reference flow
  src/pages/Customize/     Studio canvas editor panels
  src/landing/             Marketing site
server/                  API + AI engine (separate repo, linked as ./server)
docker-compose.yml       Runs client + server together
```

## Getting started

```bash
# Frontend
cd client
npm install
npm run dev          # http://localhost:5173  (expects the API on :5000)

# Backend — see https://github.com/Prateek22672/foliofyx-backend
```

Or run both with Docker:

```bash
docker compose up --build   # client on :8080, API on :5000
```

Set `VITE_API_URL` when the API isn't on `http://localhost:5000`.

## Who it's for

Students, freshers, developers, designers, freelancers — anyone who needs a polished website without building one from scratch. Free for students.

## License

MIT
