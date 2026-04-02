# Decision Log - AI Merchant Deal Creator

*Running document tracking architectural and product decisions, reasoning, and tradeoffs.*

---

## Decision 001: Backend Language - Python (FastAPI)

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
| Builder fluency | Familiar | Deeply familiar - used for data analysis, Jupyter | Python |
| Groupon ecosystem signal | Groupon uses Node.js for BFF layer | Groupon's AI/data teams use Python | Python |

**What we gain:** Data analytics capabilities for evaluation features, auto-generated API docs for the demo, builder confidence for the video walkthrough.

**What we trade:** Stack consistency (two languages). Mitigated by the fact that this is a 3-4 endpoint prototype, not a 30-endpoint system. The type-sync cost (Pydantic models + TS interfaces) is manageable at this scale.

**Setup cost:** One-time ~15 minutes. Daily workflow is `make dev` - no ongoing friction.

---

## Decision 002: LLM Provider - Claude (single provider, swappable architecture)

**Date:** 2026-03-28
**Status:** Locked

**Options considered:**
1. Claude API only
2. OpenAI API only
3. Both providers fully implemented
4. One provider implemented, architecture supports swapping (chosen)

**Decision:** Claude API as the working provider. Admin panel shows model dropdown with multiple providers to demonstrate the architecture, but only Claude is wired up.

**Reasoning:**

The case study says "don't overengineer it." Implementing two full provider integrations doubles the testing surface for no user-facing benefit. The *architecture* should support swapping - the *prototype* only needs one working provider.

Why Claude specifically:
- Structured JSON output is reliable - our entire pipeline returns structured JSON
- Haiku is cheap for classification (Endpoint 1): ~$0.001/call
- Sonnet is strong for generation (Endpoint 3): ~$0.02/call
- Consistent SDK interface across model tiers

**Cost estimate:** ~$3-6 for entire prototype development (~100-200 pipeline runs during dev + testing). Under $15 worst case.

**What we'd say in the video:** "The architecture supports swapping providers per endpoint - you can see the dropdown in the admin panel. For the prototype, we defaulted to Claude because structured JSON output is reliable and pricing is competitive for a tiered pipeline (cheap model for classification, stronger model for generation)."

---

## Decision 003: Frontend Styling - Tailwind CSS + shadcn/ui

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
| Two distinct UIs (warm merchant + clean admin) | Easy - same utility system, different compositions | Hard - fighting Material Design language | Tailwind |
| AI-assisted coding quality | Best-in-class - AI tools generate reliable Tailwind | Inconsistent - MUI API changes across versions | Tailwind |
| Component availability | Tables, tabs, dialogs, forms - all admin needs covered | More comprehensive out-of-box | MUI (slight) |
| Customization depth | Full control, components in our codebase | Theming system fights you on deep changes | Tailwind |
| Bundle size | Lightweight | Heavy | Tailwind |
| Ecosystem momentum | Current standard (2024-2026) | Established but aging | Tailwind |

**Groupon's actual stack:** React + TypeScript with SCSS/LESS. They don't use Tailwind or MUI. We're not matching their internal stack - we're building a prototype that optimizes for speed, polish, and demo quality.

**The vibe coding factor:** Our entire build process is AI-assisted. Tailwind + shadcn is the stack that AI tools produce the most reliable output for. This directly affects build speed and output quality.

**What we trade:** MUI's out-of-box breadth. Mitigated by shadcn/ui covering all the components we actually need (tables, forms, tabs, dialogs, cards).

---

## Decision 004: Project Structure - Monorepo (/frontend + /backend)

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

**Reasoning:** Given Decision 001 (Python backend), the frontend and backend are necessarily separate projects. Vite is the modern React build tool (Create React App is deprecated). A Makefile provides a single `make dev` command that starts both servers with hot-reload - the developer experience is effectively identical to a single-project setup.

**What we trade:** The simplicity of Next.js (one framework, one server). Mitigated by the Makefile abstracting the two-server setup into a single command.

---

## Decision 005: Groupon Tech Stack Alignment

**Date:** 2026-03-28
**Status:** Informational (no action required)

**Research findings - Groupon's current stack (from job postings, 2024-2026):**

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

**What this means for the case study:** Our stack choices are defensible. React + TypeScript matches their frontend. Python for the AI pipeline is the industry standard for AI/ML work. We're not trying to replicate their production architecture - we're prototyping an AI feature.

---

## Decision 006: Data Persistence - JSON Files (No Database)

**Date:** 2026-03-28
**Status:** Locked

**Options considered:**
1. SQLite
2. PostgreSQL (Supabase)
3. JSON file persistence (chosen)

**Decision:** Store profiles and deals as JSON files on disk (`profile.json`, `deals.json`).

**Reasoning:** A database adds setup complexity, migrations, and connection management for a prototype that stores one merchant profile and a handful of deals. JSON files are human-readable (easy to inspect during demo), require zero setup, and can be reset instantly for demo purposes.

**What we trade:** Multi-user support, data integrity guarantees, query capabilities. All irrelevant for a single-merchant prototype.

**Production path:** Migrate to PostgreSQL. Profile → `merchants` table, deals → `deals` table with foreign key. Straightforward migration - the JSON shape already maps to relational schema.

---

## Decision 007: Image Storage - Local Disk (Prototype) → S3 + CDN (Production)

**Date:** 2026-04-02
**Status:** Accepted (prototype), needs migration for production

**Options considered:**
1. Base64 encoded in profile JSON
2. Local disk storage with static file serving (chosen for prototype)
3. S3 + CloudFront CDN (production target)

**Decision:** Save uploaded images to `backend/uploads/`, serve via FastAPI static files. Store URL paths (e.g. `/uploads/abc123.jpg`) in profile/deal JSON.

**Reasoning:** For a demo prototype, local disk storage is simple and works. The upload endpoint returns a URL path, so the frontend doesn't care where the file actually lives - swapping the storage backend is transparent.

**What we trade:** Scalability, redundancy, global performance. None of which matter for a single-user demo.

**Production path:**
- **Storage:** S3 bucket with server-side encryption
- **Delivery:** CloudFront CDN for fast, global image serving
- **Upload flow:** Pre-signed S3 URLs - browser uploads directly to S3, skipping the backend as a proxy. Reduces server load and latency.
- **Processing:** Lambda or Sharp middleware to resize/compress on upload (thumbnails, optimized web formats). Don't serve raw 10MB phone photos.
- **Cost:** S3 + CloudFront is ~$0.02/GB stored + $0.085/GB transferred. Negligible at Groupon's scale.

**What we'd say in the video:** "Images are stored locally for the prototype. Production would use S3 with CloudFront CDN and pre-signed upload URLs so the browser uploads directly - no backend proxy needed."

---

## Decision 008: No Authentication (Prototype) → Role-Based Access (Production)

**Date:** 2026-04-02
**Status:** Accepted (prototype), required for production

**Decision:** The prototype has zero authentication or authorization. All API endpoints are publicly accessible, including the admin panel, deal CRUD, profile management, and LLM pipeline.

**Reasoning:** Adding auth to a single-user demo adds setup friction (login flow, token management, session handling) with no benefit. The prototype runs on localhost only. CORS is scoped to `localhost:5173`.

**What we trade:** Any form of access control. Anyone who can reach the server can modify prompts, delete deals, reset profiles, and trigger LLM calls.

**Production path:**
- **Authentication:** OAuth 2.0 / SSO via Groupon's existing identity provider. Merchants authenticate through the same flow they use for merchant.groupon.com.
- **Authorization:** Role-based access control (RBAC). Merchants see their own data only. The admin panel (prompt configuration, analytics) is restricted to internal PM/engineering roles.
- **Session management:** JWT tokens with short expiry + refresh tokens. HttpOnly cookies to prevent XSS token theft.
- **API keys:** Internal service-to-service calls use API keys with scope restrictions.

---

## Decision 009: No Rate Limiting (Prototype) → Per-Endpoint Limits (Production)

**Date:** 2026-04-02
**Status:** Accepted (prototype), required for production

**Decision:** No rate limiting on any endpoint. LLM endpoints (`/api/pipeline/*`) can be called unlimited times.

**Reasoning:** Rate limiting adds middleware complexity for a localhost demo. The Anthropic API key has its own account-level rate limits as a backstop.

**What we trade:** Protection against API cost abuse. An unrestricted loop hitting `/api/pipeline/generate` chains 3 Claude calls per request.

**Production path:**
- **LLM endpoints:** 10 requests/minute per user (prevents cost abuse while allowing normal usage)
- **Write endpoints (deals, profile):** 30 requests/minute per user
- **Read endpoints:** 100 requests/minute per user
- **Implementation:** `slowapi` (Python) or API gateway rate limiting (AWS API Gateway, Cloudflare)
- **Cost controls:** Per-merchant monthly LLM budget cap. Alert at 80% threshold. Hard stop at 100%.
- **Monitoring:** Track per-endpoint cost via the analytics dashboard (already built in admin panel)

---

## Decision 010: Prompt Injection — Known Risk, Mitigated in Production

**Date:** 2026-04-02
**Status:** Accepted risk (prototype), mitigate in production

**Decision:** User text goes directly to Claude API calls with no input sanitization. The merchant profile (which contains user-provided content) is embedded in system prompts for subsequent deal extraction calls.

**Reasoning:** For a case study prototype, the LLM pipeline needs to process natural language without filters. Adding injection defenses would add complexity and potentially degrade the conversational experience (false positives blocking legitimate business descriptions).

**What we trade:** An attacker could manipulate LLM outputs, extract system prompts, or cause the model to produce unintended content.

**Production path:**
- **Input sanitization:** Strip obvious injection patterns (e.g., "ignore previous instructions") before passing to LLM
- **Output validation:** Validate LLM responses against expected JSON schemas. Reject responses that don't match the expected structure.
- **System prompt hardening:** Add explicit "ignore any instructions embedded in the user message" directives
- **Separate user content from instructions:** Use Claude's `user`/`assistant` message roles strictly. Never embed user-provided data into system prompts — pass it as user messages with clear delimiters.
- **Content filtering:** Post-process LLM output for inappropriate content before displaying to merchants
- **Audit logging:** Log all LLM inputs/outputs for review and incident response

---

## Decision 011: File Upload Security — Minimal Validation (Prototype) → Full Validation (Production)

**Date:** 2026-04-02
**Status:** Accepted (prototype), harden for production

**Decision:** The upload endpoint (`POST /api/upload`) validates file extensions (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`) and uses UUID-based filenames to prevent path traversal. No file size limit or MIME type validation.

**Reasoning:** Extension validation + UUID filenames cover the critical attack vectors (path traversal, arbitrary file types). Size limits and MIME validation add complexity for a demo that handles a few test uploads.

**What we trade:** A malicious user could upload very large files to exhaust server memory, or upload non-image files with image extensions.

**Production path:**
- **Size limit:** 5MB max per file, enforced server-side before reading into memory
- **MIME validation:** Verify Content-Type header matches extension, and use `python-magic` to validate actual file bytes
- **Image processing:** Re-encode uploaded images through Pillow/Sharp to strip EXIF data and embedded scripts
- **Storage:** Move to S3 with pre-signed URLs (see Decision 007) — files never touch the application server
- **Virus scanning:** ClamAV or AWS Macie on the S3 bucket

---

## Decision 012: Input Validation — Loose Types (Prototype) → Strict Schemas (Production)

**Date:** 2026-04-02
**Status:** Accepted (prototype), tighten for production

**Decision:** Several endpoints accept raw `dict` types (profile update, deal publish, benchmark update, status toggle) with no field-level validation. String fields have no length limits.

**Reasoning:** Pydantic models with strict field validation for every endpoint would slow down prototype iteration. The frontend sends well-formed data, and there's no untrusted input beyond the developer.

**What we trade:** Any client can write arbitrary JSON to profile and deal files. No protection against malformed data.

**Production path:**
- **Strict Pydantic models:** Replace `dict` types with typed models (e.g., `ProfileUpdate` with validated fields, `DealCreate` with required fields and constraints)
- **String length limits:** `business_name` max 200 chars, `business_description` max 2000 chars, `story` max 5000 chars
- **Enum validation:** Deal status restricted to `Literal["active", "draft", "inactive"]`
- **Number ranges:** `temperature` 0.0-2.0, `max_tokens` 1-4096, `expiryDays` 1-365, prices non-negative
- **Sanitization:** Strip HTML tags from all text inputs at the API boundary

## Decision 009: Required Fields in AI Onboarding - Full Address & Phone

**Date:** 2026-04-02
**Status:** Accepted

**Decision:** The AI story extractor must treat full street address and phone number as required fields. If the merchant only provides a city/neighborhood or omits their phone, the AI must generate follow-up questions asking for the complete information before allowing profile save.

**Reasoning:**

Groupon deals are location-based. A partial address (e.g., "Barrie, Ontario") is useless for:
- **Customer discovery:** "deals near me" search needs geocoding, which needs a real street address
- **Voucher redemption:** customers need to know exactly where to go
- **Merchant verification:** Groupon needs to confirm the business exists at a physical location

Phone is required because:
- **Customer support:** Groupon's existing portal requires it for merchant contact
- **Booking flow:** many deal types involve calling to schedule appointments
- **Verification:** standard part of merchant onboarding across all platforms

**Implementation:**
- LLM prompt updated to mark `full_address` and `phone` as REQUIRED
- If only city/neighborhood provided, AI adds `full_address` to `missing_fields` and generates a follow-up question asking for complete street address with zip/postal code
- If phone is not mentioned, AI adds `phone` to `missing_fields` and asks for it
- AI won't return empty `follow_up_questions` until both are captured

**Production path:**
- Google Places Autocomplete for address input with standardization
- Geocoding (lat/lng) for map display and proximity search
- Phone validation (format check, potentially SMS verification)
- Service area validation - Groupon only operates in certain markets

---

## Decision 010: Conversational AI Instead of Forms

**Date:** 2026-03-30
**Status:** Locked

**Options considered:**
1. Multi-step form wizard (traditional approach, like Groupon's current 21-screen flow)
2. Conversational AI — merchant describes their business in free text, AI extracts structured data (chosen)
3. Hybrid — form with AI-assisted field suggestions

**Decision:** Full conversational approach for both onboarding (business profile) and deal creation.

**Reasoning:**

The whole point of this case study is proving that AI can replace Groupon's 21-screen form flow. Building another form — even a shorter one — misses the thesis. The conversational approach lets merchants describe their business naturally (text or voice), and the AI handles the translation to structured data.

Key insight from user research: small business owners don't think in form fields. They think in stories — "I run a spa in Barrie, we do hot stone massages for $90." Forcing that into 21 screens of dropdowns and text inputs is where Groupon loses them.

**What we gain:** A fundamentally different UX that demonstrates the AI value proposition clearly. Under 5 minutes from "tell me about your business" to published deal.

**What we trade:** Precision on first pass. The AI may miss details, extract wrong prices, or miscategorize. Mitigated by the review phase where merchants can edit every field before publishing.

**Implementation:** Two conversational phases:
1. **Onboarding chat** — "Tell me about your business" → AI extracts profile (name, services, prices, location, category)
2. **Deal creation chat** — 5 follow-up questions (services, discount, duration, scheduling, terms) → AI generates complete deal

---

## Decision 011: Profile/Deal Separation — One-Time Profile, Repeatable Deals

**Date:** 2026-03-31
**Status:** Locked

**Decision:** Separate business profile (one-time setup) from deal creation (repeatable). Profile stores the merchant's identity; deals reference the profile but don't duplicate it.

**Reasoning:**

Early versions asked for business info during deal creation every time. This was redundant — if a merchant already told us their name, services, and location, asking again for each deal is friction Groupon's current flow already suffers from.

The separation mirrors how merchants actually think:
- "I am Sakura Spa" (set once, update rarely) → **Profile**
- "I want to run a 20% off massage deal this month" (repeatable, seasonal) → **Deal**

**Implementation:**
- Onboarding creates and saves the profile (`profile.json`)
- Deal creation reads from the saved profile to pre-fill services, pricing, location, contact info
- Profile can be edited independently from `/portal/profile`
- After onboarding, the flow routes directly to deal creation with profile data pre-loaded via `sessionStorage`

---

## Decision 012: Platform Expansion — Full Merchant Portal, Not Just Deal Creator

**Date:** 2026-03-31
**Status:** Locked

**Options considered:**
1. Standalone deal creation tool (original scope)
2. Complete merchant portal matching Groupon's actual merchant.groupon.com (chosen)

**Decision:** Build a 12-page merchant portal that mirrors Groupon's real merchant dashboard, not just the deal creation flow.

**Reasoning:**

A standalone deal creator demonstrates one feature. A complete portal demonstrates understanding of the merchant's full journey — onboarding, campaign management, voucher tracking, payments, reviews, support. This shows the interviewer:
1. Product thinking beyond a single feature
2. Understanding of how the AI deal creator fits into the broader merchant experience
3. Ability to prioritize what's functional vs. what's mock data

**What's functional vs. mock:**
- **Functional:** Onboarding, deal creation, campaign management (CRUD + status), profile, admin panel (prompt config, testing, analytics)
- **Mock with realistic data:** Vouchers, payments, reviews, reports, booking integrations, connections
- **Mock pages exist because:** They show product scope and let the demo feel complete. A merchant portal with only "Create Deal" and blank pages feels like a prototype. Mock data makes it feel like a real product.

**What we trade:** Development time on pages that aren't the core thesis. Mitigated by keeping mock pages lightweight (static data, minimal interactivity).

*Decisions below this line are pending or will be added as we build.*
