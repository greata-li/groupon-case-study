# AI Merchant Deal Creator — Groupon Case Study

AI-powered deal creation tool that helps small merchants go from "I want more customers" to a published Groupon deal in under 5 minutes.

## Quick Start

### 1. Set up your API key

```bash
# Edit backend/.env and add your Anthropic API key
# Get one at https://console.anthropic.com
```

### 2. Install dependencies

```bash
# Backend
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 3. Run both servers

```bash
# Terminal 1: Backend (from /backend)
source venv/Scripts/activate
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend (from /frontend)
npm run dev
```

### 4. Open in browser

- **Merchant experience:** http://localhost:5173/
- **Admin panel:** http://localhost:5173/admin
- **API docs:** http://localhost:8000/docs

## Project Structure

```
groupon-case-study/
├── case-study/           # PRD, CLAUDE.md, design notes, original brief
├── frontend/             # React + Vite + TypeScript + Tailwind + shadcn/ui
│   └── src/
│       ├── pages/admin/      # Admin panel pages
│       ├── pages/merchant/   # Merchant flow pages
│       ├── components/       # Shared + layout components
│       └── lib/api.ts        # API client + types
├── backend/              # FastAPI + Python
│   ├── app/
│   │   ├── endpoints/    # Pipeline endpoint handlers
│   │   ├── config/       # Prompt configs (JSON, editable via admin)
│   │   └── data/         # Synthetic benchmark data
│   └── main.py           # FastAPI app + routes
├── decisions.md          # Decision log with reasoning
└── README.md
```

## Architecture

**3-endpoint AI pipeline:**
1. **Business Classifier** (Haiku) — categorizes the business
2. **Market Intelligence** (Haiku) — recommends pricing and deal structure
3. **Deal Generator** (Sonnet) — creates the complete deal

All prompts are configurable via the admin panel. No code changes needed to iterate.
