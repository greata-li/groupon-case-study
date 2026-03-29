# Decision Log — AI Merchant Deal Creator

*Running document tracking architectural and product decisions, reasoning, and tradeoffs.*

---

## Decision 001: Backend Language — Python (FastAPI)

**Date:** 2026-03-28
**Status:** Locked

**Options considered:**
1. Node.js + TypeScript (Express or Fastify)
2. Python + FastAPI

**Decision:** Python with FastAPI.

**Reasoning:**

| Factor | Node.js | Python | Winner |
|--------|---------|--------|--------|
| Stack consistency | Single language (TS) across frontend + backend | Two languages (TS frontend, Python backend) | Node.js |
| AI/data ecosystem | Limited analytics libraries | pandas, numpy, native Jupyter support | Python |
| LLM SDK support | First-class Anthropic + OpenAI SDKs | First-class Anthropic + OpenAI SDKs | Tie |
| Performance (I/O-bound) | Excellent async | FastAPI async is comparable | Tie |
| Auto-generated API docs | Requires additional setup | FastAPI generates Swagger UI free at `/docs` | Python |
| Builder fluency | Familiar | Deeply familiar — used for data analysis, Jupyter | Python |
| Groupon ecosystem signal | Groupon uses Node.js for BFF layer | Groupon's AI/data teams use Python | Python |

**What we gain:** Data analytics capabilities for evaluation features, auto-generated API docs for the demo, builder confidence for the video walkthrough.

**What we trade:** Stack consistency (two languages). Mitigated by the fact that this is a 3-4 endpoint prototype, not a 30-endpoint system. The type-sync cost (Pydantic models + TS interfaces) is manageable at this scale.

**Setup cost:** One-time ~15 minutes. Daily workflow is `make dev` — no ongoing friction.

---

## Decision 002: LLM Provider — Claude (single provider, swappable architecture)

**Date:** 2026-03-28
**Status:** Locked

**Options considered:**
1. Claude API only
2. OpenAI API only
3. Both providers fully implemented
4. One provider implemented, architecture supports swapping (chosen)

**Decision:** Claude API as the working provider. Admin panel shows model dropdown with multiple providers to demonstrate the architecture, but only Claude is wired up.

**Reasoning:**

The case study says "don't overengineer it." Implementing two full provider integrations doubles the testing surface for no user-facing benefit. The *architecture* should support swapping — the *prototype* only needs one working provider.

Why Claude specifically:
- Structured JSON output is reliable — our entire pipeline returns structured JSON
- Haiku is cheap for classification (Endpoint 1): ~$0.001/call
- Sonnet is strong for generation (Endpoint 3): ~$0.02/call
- Consistent SDK interface across model tiers

**Cost estimate:** ~$3-6 for entire prototype development (~100-200 pipeline runs during dev + testing). Under $15 worst case.

**What we'd say in the video:** "The architecture supports swapping providers per endpoint — you can see the dropdown in the admin panel. For the prototype, we defaulted to Claude because structured JSON output is reliable and pricing is competitive for a tiered pipeline (cheap model for classification, stronger model for generation)."

---

## Decision 003: Frontend Styling — Tailwind CSS + shadcn/ui

**Date:** 2026-03-28
**Status:** Locked

**Options considered:**
1. Tailwind CSS + shadcn/ui
2. Material UI (MUI)
3. Plain CSS / SCSS

**Decision:** Tailwind CSS with shadcn/ui component library.

**Reasoning:**

| Factor | Tailwind + shadcn/ui | Material UI | Winner |
|--------|---------------------|-------------|--------|
| Two distinct UIs (warm merchant + clean admin) | Easy — same utility system, different compositions | Hard — fighting Material Design language | Tailwind |
| AI-assisted coding quality | Best-in-class — AI tools generate reliable Tailwind | Inconsistent — MUI API changes across versions | Tailwind |
| Component availability | Tables, tabs, dialogs, forms — all admin needs covered | More comprehensive out-of-box | MUI (slight) |
| Customization depth | Full control, components in our codebase | Theming system fights you on deep changes | Tailwind |
| Bundle size | Lightweight | Heavy | Tailwind |
| Ecosystem momentum | Current standard (2024-2026) | Established but aging | Tailwind |

**Groupon's actual stack:** React + TypeScript with SCSS/LESS. They don't use Tailwind or MUI. We're not matching their internal stack — we're building a prototype that optimizes for speed, polish, and demo quality.

**The vibe coding factor:** Our entire build process is AI-assisted. Tailwind + shadcn is the stack that AI tools produce the most reliable output for. This directly affects build speed and output quality.

**What we trade:** MUI's out-of-box breadth. Mitigated by shadcn/ui covering all the components we actually need (tables, forms, tabs, dialogs, cards).

---

## Decision 004: Project Structure — Monorepo (/frontend + /backend)

**Date:** 2026-03-28
**Status:** Locked

**Options considered:**
1. Next.js full-stack (single project)
2. Monorepo with /frontend (React + Vite) and /backend (FastAPI)

**Decision:** Monorepo structure. Next.js is not viable with a Python backend.

**Structure:**
```
groupon-case-study/
├── case-study/           # Docs (PRD, CLAUDE.md, case study PDF, decisions)
├── frontend/             # React + Vite + TypeScript + Tailwind + shadcn/ui
├── backend/              # FastAPI + Python
├── Makefile              # `make dev` runs both servers
└── decisions.md          # This document
```

**Reasoning:** Given Decision 001 (Python backend), the frontend and backend are necessarily separate projects. Vite is the modern React build tool (Create React App is deprecated). A Makefile provides a single `make dev` command that starts both servers with hot-reload — the developer experience is effectively identical to a single-project setup.

**What we trade:** The simplicity of Next.js (one framework, one server). Mitigated by the Makefile abstracting the two-server setup into a single command.

---

## Decision 005: Groupon Tech Stack Alignment

**Date:** 2026-03-28
**Status:** Informational (no action required)

**Research findings — Groupon's current stack (from job postings, 2024-2026):**

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Redux |
| SSR | Next.js (adopted recently) |
| Styling | SCSS / LESS |
| API Layer | GraphQL + REST |
| Backend (BFF) | Node.js |
| Backend Services | Java, Ruby on Rails, TypeScript (Encore.ts) |
| New initiative | "AI-first CoreApps Platform" using Encore.ts |

**How our stack aligns:**
- React + TypeScript frontend: direct match
- Python backend: aligns with AI/data team practices (not their web BFF layer)
- Our prototype sits in the "AI-first" space that Groupon is actively investing in

**What this means for the case study:** Our stack choices are defensible. React + TypeScript matches their frontend. Python for the AI pipeline is the industry standard for AI/ML work. We're not trying to replicate their production architecture — we're prototyping an AI feature.

---

*Decisions below this line are pending or will be added as we build.*
