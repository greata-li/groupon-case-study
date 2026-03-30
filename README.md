# AI Merchant Deal Creator — Groupon Case Study

AI-powered deal creation tool that helps small merchants go from "I want more customers" to a published Groupon deal in under 5 minutes — replacing Groupon's current 21-screen, 30+ decision flow with 5 questions and one publish button.

## Quick Start

### 1. Set up your API key

```bash
# Edit backend/.env and add your Anthropic API key
# Get one at https://console.anthropic.com
ANTHROPIC_API_KEY=your-key-here
```

### 2. Install dependencies

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate           # Windows CMD/PowerShell
# source venv/bin/activate      # Mac/Linux
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 3. Run both servers

**Windows (CMD/PowerShell):**
```bash
# Terminal 1: Backend
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Mac/Linux or Git Bash:**
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 4. Open in browser

- **Merchant experience:** http://localhost:5173/
- **Admin panel:** http://localhost:5173/admin
- **API docs (Swagger):** http://localhost:8000/docs

## What This Solves

Sofia owns a waxing and lash studio in Chicago. She wants to try Groupon but stalls at deal creation — she doesn't know what discount to set, what copy to write, or what category to pick. She has 20 minutes between clients.

**Current Groupon flow:** 21 screens, 30+ decisions, broken links, silent failures, irreversible draft actions.

**Our AI flow:** 5 questions about her business → AI generates a complete, publish-ready deal → Sofia reviews, edits anything, publishes.

## Project Structure

```
groupon-case-study/
├── case-study/               # Research & documentation
│   ├── PRD.md                # Product requirements document
│   ├── CLAUDE.md             # Build instructions & architecture
│   ├── findings.md           # Real bugs found in Groupon's merchant flow
│   ├── flow-mapping.md       # Field-by-field mapping: their 21 screens → our AI
│   ├── scope-expansion-plan.md
│   └── design-notes.md       # Groupon visual design reference
├── frontend/                 # React + Vite + TypeScript + Tailwind + shadcn/ui
│   └── src/
│       ├── pages/admin/      # Admin panel (endpoint list, test panel, benchmarks)
│       ├── pages/merchant/   # Merchant flow (welcome, intake, preview, publish)
│       ├── components/       # Layouts + shared UI
│       └── lib/api.ts        # API client + TypeScript types
├── backend/                  # FastAPI + Python
│   ├── app/
│   │   ├── endpoints/        # Pipeline endpoint handlers
│   │   ├── config/           # Prompt configs (JSON, editable via admin panel)
│   │   └── data/             # Synthetic benchmark data
│   └── main.py               # FastAPI app + all routes
├── _raw/screenshots/         # 27 screenshots of Groupon's actual merchant flow
├── decisions.md              # Decision log with reasoning for every tech choice
└── README.md
```

## Architecture

**4-endpoint AI pipeline:**

| Endpoint | Model | Purpose |
|----------|-------|---------|
| Business Classifier | Haiku | Categorizes business from description |
| Service Suggester | Haiku | Suggests services + typical prices during intake |
| Market Intelligence | Haiku | Recommends discount depth and deal structure |
| Deal Generator | Sonnet | Creates the complete deal (title, description, highlights, pricing, fine print, voucher instructions) |

All prompts are configurable via the admin panel — no code changes needed to iterate.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + TypeScript + Vite | Modern, fast, type-safe |
| Styling | Tailwind CSS + shadcn/ui | Customizable components, Plus Jakarta Sans typography |
| Backend | Python + FastAPI | AI/data ecosystem, auto-generated API docs |
| LLM | Claude API (Anthropic) | Reliable structured JSON output, tiered pricing |
| Data | JSON files | Synthetic benchmarks for Beauty & Spas / Chicago |

## Key Features

### Merchant Experience
- 5-step intake with AI service suggestions (chips auto-populate from business description)
- Deal preview matching Groupon's actual listing layout
- Highlights, per-option descriptions, structured fine print — all AI-generated
- Every field editable with click-to-edit
- Confidence indicators flagging uncertain AI outputs for review
- "Complete before publishing" section for contact details

### Admin Panel
- Pipeline endpoint list with flow connectors showing execution order
- Prompt editor with model/temperature/token configuration
- Test panel — run any endpoint with sample input, compare outputs across iterations
- Benchmark data editor with documented assumptions

## Documentation

- [decisions.md](decisions.md) — Why we chose Python, Claude, Tailwind, monorepo
- [case-study/PRD.md](case-study/PRD.md) — Full product requirements with metrics
- [case-study/findings.md](case-study/findings.md) — Real bugs found in Groupon's merchant flow
- [case-study/flow-mapping.md](case-study/flow-mapping.md) — Their 21 screens mapped to our 5 questions
