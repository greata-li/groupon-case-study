# AI Merchant Deal Creator - Groupon Case Study

A complete AI-powered merchant platform that replaces Groupon's 21-screen deal creation flow with a conversational AI experience. Merchants describe their business in natural language - the AI extracts everything, builds the deal, and lets them review and publish in under 5 minutes.

Built with real Claude API calls (not mocks) across 7 configurable LLM endpoints.

## Quick Start

### Prerequisites

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Anthropic API key** - [Get one](https://console.anthropic.com)

### 1. Clone and set up your API key

```bash
git clone https://github.com/greata-li/groupon-case-study.git
cd groupon-case-study

# Copy the example env file and add your API key
cp backend/.env.example backend/.env
# Edit backend/.env and replace "your-api-key-here" with your Anthropic API key
```

### 2. Install dependencies

**Windows (CMD or PowerShell):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

cd ..\frontend
npm install
```

**Mac / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd ../frontend
npm install
```

### 3. Run both servers

You need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate           # Windows
# source venv/bin/activate      # Mac/Linux
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Open in browser

| URL | What |
|-----|------|
| http://localhost:5173/ | Landing page (start here) |
| http://localhost:5173/onboarding | AI onboarding (chat + voice) |
| http://localhost:5173/portal/home | Merchant portal dashboard |
| http://localhost:5173/portal/create | AI deal creation (chat + 7-step builder) |
| http://localhost:5173/admin | Pipeline admin panel |
| http://localhost:8000/docs | API documentation (Swagger) |

### Demo Walkthrough

1. Start at the **landing page** (http://localhost:5173/)
2. Click **Get Started** to begin AI onboarding
3. Describe a business (or use the example prompts)
4. Review the AI-extracted profile, then continue to deal creation
5. Walk through the 7-step deal builder with AI pre-filled content
6. Publish and manage deals from the **Campaigns** page

Use the **Reset Profile** button in the Admin panel to start over with a fresh merchant.

## What This Solves

Sofia owns a waxing and lash studio. She has 20 minutes between clients. Groupon's current campaign builder asks her to fill out **21 screens** of forms - booking platform, categories, pricing, copy, photos, highlights, descriptions, fine print, voucher instructions, business info, payment, tax compliance. She drops off.

**Our approach:** Sofia tells us about her business in her own words (text or voice). The AI extracts her profile, creates a complete deal, and lets her review. Under 5 minutes, no marketing expertise needed.

## Architecture

### AI Pipeline (7 Endpoints)

| Endpoint | Model | Purpose |
|----------|-------|---------|
| Story Extractor | Sonnet | Parse natural language into structured business profile |
| Deal Extractor | Sonnet | Parse deal chat into complete deal data |
| Business Classifier | Haiku | Categorize business from description |
| Service Suggester | Haiku | Suggest services with typical prices |
| Market Intelligence | Haiku | Recommend discount depth and deal structure |
| Deal Generator | Sonnet | Create complete deal as structured JSON |
| Text Enhancer | Haiku | "Inspire Me" copywriting for any field |

All prompts, models, and temperatures are configurable via the admin panel without code changes.

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + TypeScript + Vite | Modern, type-safe, fast hot-reload |
| Styling | Tailwind CSS + shadcn/ui | Plus Jakarta Sans, Groupon green brand |
| Backend | Python + FastAPI | AI ecosystem, auto-generated API docs |
| LLM | Claude API (Anthropic) | Reliable structured JSON, tiered pricing |
| Data | JSON file persistence | Profile, deals, configs - no database setup needed |

## Key Features

### Conversational AI Onboarding
- Chat or voice: "Tell me about your business"
- AI extracts name, category, services, prices, location, highlights
- Follow-up questions for missing info (full address and phone are required)
- Profile review with live customer preview
- Photo upload with server-side persistence
- Flows directly into first deal creation

### AI-Assisted Deal Creation
- Multi-turn chat: services, discount, duration, scheduling, terms
- AI generates complete deal (title, highlights, descriptions, pricing, fine print)
- 7-step review builder with all fields pre-filled
- "Inspire Me" AI copywriting + Voice Dictation on text fields
- Live customer preview sidebar
- Save as Draft or Publish

### Merchant Portal (12 Pages)
Matches Groupon's actual merchant portal structure:
- **Home**: Onboarding checklist with progress tracking
- **Campaigns**: Active/Drafts with status toggle, edit, preview, delete
- **Booking**: Platform integrations with credential dialogs
- **Voucher List**: Filterable table with status badges
- **Customer Reviews**: Review management
- **Payments**: Payout tracking with expandable detail
- **Reports**: Downloadable CSV reports
- **Support**: Knowledge base
- **Connections**: Third-party credential management (Booker, Mindbody, Square, Google, Yelp)

### Pipeline Admin Panel
- 7 configurable LLM endpoints with model/temperature/token controls
- Prompt editor - iterate on prompts without touching code
- Test panel: run any endpoint with sample input
- Analytics dashboard with pipeline metrics
- Benchmark data editor
- Reset Profile button for demo walkthroughs

## Project Structure

```
groupon-case-study/
├── frontend/                     # React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── pages/portal/         # Merchant portal (12 pages)
│       ├── pages/onboarding/     # Conversational AI onboarding
│       ├── pages/admin/          # Pipeline admin panel
│       ├── pages/merchant/       # Landing page
│       ├── components/           # Layouts + shared UI
│       └── lib/                  # API client, validation, helpers
├── backend/                      # FastAPI + Python
│   ├── main.py                   # All API routes
│   ├── app/
│   │   ├── endpoints/            # LLM pipeline handlers
│   │   ├── config/               # Prompt configs (JSON, admin-editable)
│   │   └── data/                 # Benchmarks, profile, deals
│   └── uploads/                  # Uploaded photos (gitignored)
├── case-study/                   # Documentation
│   ├── deliverables/             # Handoff documents
│   │   ├── CASE_STUDY.md         # Main case study document
│   │   ├── decisions.md          # 16 technical decisions with reasoning
│   │   ├── iteration-log.md      # Development phases and learnings
│   │   ├── findings.md           # Real bugs in Groupon's merchant flow
│   │   └── flow-mapping.md       # Their 21 screens → our AI approach
│   ├── planning/                 # Architecture plans
│   └── internal/                 # Build notes (not part of submission)
└── README.md
```

## Documentation

| Document | Description |
|----------|-------------|
| [CASE_STUDY.md](case-study/deliverables/CASE_STUDY.md) | Main deliverable: problem, metrics, solution, iteration |
| [decisions.md](case-study/deliverables/decisions.md) | 16 technical decisions with options, tradeoffs, production paths |
| [iteration-log.md](case-study/deliverables/iteration-log.md) | Development phases: what changed, what we learned |
| [findings.md](case-study/deliverables/findings.md) | Real bugs found in Groupon's current merchant flow |
| [flow-mapping.md](case-study/deliverables/flow-mapping.md) | Field-by-field mapping of 21 screens to our AI approach |
