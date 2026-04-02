# AI Merchant Deal Creator — Groupon Case Study

A complete AI-powered merchant platform that replaces Groupon's 21-screen deal creation flow with a conversational AI experience. Merchants describe their business in natural language — the AI extracts everything, builds the deal, and lets them review and publish in under 5 minutes.

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

```bash
# Terminal 1: Backend
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 4. Open in browser

| URL | What |
|-----|------|
| http://localhost:5173/ | Landing page |
| http://localhost:5173/onboarding | AI business onboarding (chat + voice) |
| http://localhost:5173/portal | Full merchant portal (12 pages) |
| http://localhost:5173/portal/create | AI deal creation (chat → builder) |
| http://localhost:5173/admin | Pipeline admin (7 endpoints, test panel, analytics) |
| http://localhost:8000/docs | API documentation (auto-generated Swagger) |

### For Demo

Use the **Reset Profile** button in the Admin panel to simulate a new merchant. This clears the profile and deals so you can walk through the full onboarding → deal creation flow from scratch.

## What This Solves

Sofia owns a waxing and lash studio. She has 20 minutes between clients. Groupon's current campaign builder asks her to fill out **21 screens** of forms — booking platform, 3-level categories, pricing, copy, photos, highlights, descriptions, fine print, voucher instructions, business info, payment, tax compliance. She drops off.

**Our approach:** Sofia tells us about her business in her own words (text or voice). The AI extracts her profile, creates a complete deal, and lets her review. Under 5 minutes, no marketing expertise needed.

## Project Structure

```
groupon-case-study/
├── case-study/                   # Documentation
│   ├── deliverables/             # Case study submission docs
│   │   ├── CASE_STUDY.md         # Main case study document (PSD)
│   │   ├── iteration-log.md      # What changed, what broke, what we learned
│   │   ├── video-script.md       # Video walkthrough script
│   │   ├── findings.md           # Real bugs in Groupon's merchant flow
│   │   └── flow-mapping.md       # Their 21 screens → our AI approach
│   ├── planning/                 # Architecture and design plans
│   │   ├── PRD.md                # Product requirements
│   │   ├── platform-rebuild-plan.md
│   │   ├── merchant-portal-plan.md
│   │   └── conversational-intake-plan.md
│   └── internal/                 # Build instructions
│       ├── CLAUDE.md
│       └── design-notes.md
├── frontend/                     # React + Vite + TypeScript + Tailwind + shadcn/ui
│   └── src/
│       ├── pages/portal/         # Merchant portal (12 pages)
│       ├── pages/onboarding/     # Conversational AI onboarding
│       ├── pages/admin/          # Admin panel (endpoints, test, analytics)
│       ├── pages/merchant/       # Landing page
│       ├── components/           # Layouts + shared UI
│       └── lib/                  # API client, validation, checklist helpers
├── backend/                      # FastAPI + Python
│   ├── app/
│   │   ├── endpoints/            # Pipeline endpoint handlers
│   │   ├── config/               # Prompt configs (JSON, editable via admin)
│   │   └── data/                 # Benchmarks, profile, deals (JSON persistence)
│   └── main.py                   # FastAPI app + all routes
├── decisions.md                  # Technical decision log with reasoning
└── README.md
```

## Architecture

### AI Pipeline (7 endpoints)

| Endpoint | Model | Purpose |
|----------|-------|---------|
| Story Extractor | Sonnet | Parse natural language into structured business profile |
| Deal Extractor | Sonnet | Parse deal description into complete deal data |
| Business Classifier | Haiku | Categorize business from description |
| Service Suggester | Haiku | Suggest services with typical prices |
| Market Intelligence | Haiku | Recommend discount depth and deal structure |
| Deal Generator | Sonnet | Create complete deal as structured JSON |
| Text Enhancer | Haiku | "Inspire Me" copywriting for any field |

All prompts, models, and temperatures are configurable via the admin panel — no code changes needed.

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + TypeScript + Vite | Modern, type-safe, fast hot-reload |
| Styling | Tailwind CSS + shadcn/ui | Plus Jakarta Sans, Groupon green brand |
| Backend | Python + FastAPI | AI ecosystem, auto-generated API docs |
| LLM | Claude API (Anthropic) | Reliable structured JSON, tiered pricing (Haiku/Sonnet) |
| Data | JSON file store | Profile, deals, configs persist across restarts |

## Key Features

### Conversational AI Onboarding
- Chat/voice interface: "Tell me about your business"
- AI extracts: name, category, services, prices, location, highlights
- Follow-up questions for missing info
- Profile review with live customer preview
- Flows directly into first deal creation

### AI-Assisted Deal Creation
- Multi-turn chat: services → discount → duration → scheduling → terms
- AI generates complete deal (title, highlights, descriptions, pricing, fine print)
- 7-step review builder with all fields pre-filled
- "Inspire Me" + Voice Dictation on every text field
- Live customer preview sidebar
- Save as Draft or Publish

### Complete Merchant Portal
12 pages matching Groupon's actual merchant portal:
- **Home**: Onboarding checklist with progress tracking
- **Campaigns**: Active/Drafts with status toggle, edit, preview, delete
- **Booking**: Platform integration info with connect dialogs
- **Voucher List**: Filterable table with status badges
- **Customer Reviews**: AI-suggested response generation
- **Payments**: Payout tracking with expandable drill-down
- **Reports**: Downloadable CSV reports
- **Support**: Knowledge base + AI chatbot
- **Connections**: Credential management (Booker, Mindbody, Square, Google, Yelp)

### Pipeline Admin Panel
- 7 configurable LLM endpoints with model dropdown (Haiku/Sonnet/Opus)
- Prompt editor with temperature and token controls
- Test panel: run any endpoint, compare outputs
- Analytics: pipeline costs, latency, field acceptance rates
- Benchmark data editor (collapsible raw JSON)
- API Docs link (auto-generated Swagger)
- Reset Profile button for demo walkthroughs

## Documentation

| Document | Description |
|----------|-------------|
| [CASE_STUDY.md](case-study/deliverables/CASE_STUDY.md) | Main deliverable: problem, metrics, solution, what to change/kill |
| [iteration-log.md](case-study/deliverables/iteration-log.md) | 8 phases: what changed, what broke, prompt engineering |
| [video-script.md](case-study/deliverables/video-script.md) | 10-minute walkthrough script |
| [findings.md](case-study/deliverables/findings.md) | Real bugs found in Groupon's merchant flow |
| [flow-mapping.md](case-study/deliverables/flow-mapping.md) | Their 21 screens mapped to our AI approach |
| [decisions.md](decisions.md) | Technical decisions with reasoning |
| [PRD.md](case-study/planning/PRD.md) | Product requirements and success metrics |
