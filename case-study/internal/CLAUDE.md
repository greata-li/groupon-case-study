# Groupon Case Study: AI Merchant Deal Creator

## What this is

A working prototype for a Groupon interview case study. An AI-powered deal creation tool that helps small merchants (like Sofia, a waxing/lash studio owner in Chicago) go from "I want more customers" to a published Groupon deal in under 5 minutes — without needing marketing expertise.

## The PRD

Read `PRD.md` in this folder first. It has the full problem statement, metrics, user flow, pipeline architecture, and scope decisions.

## What we're building

### 1. Merchant Experience (Sofia's side)
- Simple intake: 5 questions about her business (name, services, location, prices, anything else)
- AI generates a complete deal: title, description, fine print, pricing with discount, category, scheduling recommendation
- Deal preview that looks like a real listing — she reviews, edits any field, publishes
- Must feel fast, professional, and trustworthy. She has 20 minutes.

### 2. Admin/PM Experience
- List of all LLM endpoints in the pipeline (like an intent management dashboard)
- Click into any endpoint: see/edit system prompt, model selection, temperature, parameters
- Test panel: run any endpoint with sample input, see the output
- Benchmark data editor: view/update the synthetic market intelligence data
- This is how a PM iterates on prompts without touching code

### 3. AI Pipeline (3-4 endpoints)
- **Endpoint 1: Business Classifier** — business description + location → category, subcategory, tags. Cheap/fast model.
- **Endpoint 2: Market Intelligence** — category + location + prices → recommended discount, pricing, deal structure. Can be heuristic (lookup) or LLM-assisted.
- **Endpoint 3: Deal Generator** — all inputs + market data → complete deal as structured JSON. Stronger model.
- **Endpoint 4: Deal Optimizer** (optional) — when Sofia edits a field, gently suggest if her edit might hurt performance.

### 4. Synthetic Market Data
- JSON file with benchmark data for Beauty & Spas in Chicago
- Average discount depth by service type, top-performing title patterns, fine print templates
- In production this would pull from Groupon's actual deal performance data

## Tech stack

- **Frontend:** React + TypeScript
- **Backend:** Node.js or Python API
- **LLM:** Claude API or OpenAI API (configurable per endpoint in the admin)
- **Data:** JSON files for synthetic benchmarks and endpoint configs
- **Build tools:** Claude Code for backend, Loveable or Claude Code for frontend

## Architecture reference

Read `../../_archive/0ne-app/Pipeline - KT 303fd05c8f73805b9cc3c9a5b6010d45.md` for how a similar pipeline was built at 0ne (AI shopping assistant). Same pattern: intent classification → search/retrieval → ranking → user presentation. The Groupon version is simpler (3-4 endpoints vs 15+) but follows the same principles:
- Each endpoint has one job with clear input/output
- Structured JSON output from every LLM call
- Heuristics for predictable tasks, LLM only where semantic understanding is needed
- Human-in-the-loop: Sofia always reviews before publishing
- Confidence scores: flag uncertain fields for manual review

## Design principles

- **Sofia's experience comes first.** The frontend must look polished and professional. A beautiful pipeline with an ugly UI is a failed demo.
- **Show the work.** The admin panel exists to show iteration. Prompts, test results, what changed and why.
- **Prompts are configurable, not hardcoded.** Admin panel reads/writes prompt configs. Pipeline reads from those configs at runtime.
- **State assumptions explicitly.** Every piece of synthetic data should be clearly marked as an assumption.
- **Build for the video.** Everything we build needs to demo well in a screen recording walkthrough.

## Build order

1. **Admin panel first** — endpoint list, prompt editor, test panel. This is the PM's workbench.
2. **Merchant intake flow** — 5-question form, clean UI
3. **Pipeline integration** — connect intake to LLM endpoints, generate deal JSON
4. **Deal preview** — show Sofia the generated deal, let her edit, publish
5. **Polish** — make it look professional enough for a video demo

## Voice and tone

- The merchant-facing UI should feel warm, simple, and confident. Sofia should think "this is easy."
- The admin panel should feel clean and functional. A PM should think "I can work with this."
- No jargon in the merchant experience. No "LLM" or "pipeline" or "endpoint." Just "we'll create your deal."

## What NOT to build

- Don't replicate Groupon's full platform (sign-up, account management, analytics)
- Don't build photo upload or AI image generation
- Don't build post-publish optimization
- Don't build multi-language support
- Don't over-engineer the backend — this is a prototype, not production infrastructure
