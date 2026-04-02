# Iteration Log — What Changed, What Broke, What We Learned

*Documenting the evolution from initial concept to final prototype.*

---

## Phase 1: Initial Concept (Days 1-2)

### Starting Point
Read the case study brief. Identified the core problem: Sofia drops off at deal creation because she's asked to make decisions she has no basis for making.

### First Approach: Simple AI Deal Generator
- 5-question intake form (step-by-step wizard)
- 3-endpoint LLM pipeline: Classifier → Market Intelligence → Deal Generator
- Admin panel for prompt editing
- Simple deal preview

### What Worked
- The pipeline architecture was sound — each endpoint has one job
- Admin panel concept was strong — PM can iterate without code changes
- Claude's structured JSON output was reliable

### What Didn't Work
- **The intake form was still a form** — we reduced 21 screens to 5, but Sofia still had to fill out every field manually
- **No real comparison to Groupon** — we hadn't studied their actual flow yet
- **Deal preview was too simple** — didn't cover all the fields Groupon actually needs

---

## Phase 2: Product Investigation (Day 3)

### What Changed Everything
Signed up as an actual Groupon merchant. Documented 27 screenshots of the entire campaign builder + 12 screenshots of the merchant portal.

### Key Discoveries
1. Groupon's onboarding email link is broken (404)
2. Backend returns 502 errors on Step 4 with no user feedback
3. The campaign builder has 21 screens — far more than our initial 5 questions covered
4. Groupon already has "Inspire Me" buttons — basic AI assistance exists
5. The merchant portal has 12 sidebar pages — a full management platform

### Impact on Our Approach
- Realized our prototype was too minimal — it didn't cover what Groupon actually collects
- Created a field-by-field mapping: every field from their 21 screens mapped to our AI approach
- Expanded scope: from "deal generator" to "complete merchant platform"

---

## Phase 3: Platform Build (Days 3-4)

### Expanded to Full Merchant Portal
Built all 12 sidebar pages matching Groupon's actual merchant portal:
- Campaigns, Booking, Voucher List, Customer Reviews, Payments, Reports, Support, Connections

### Business Onboarding (9-step flow)
Initially built a traditional step-by-step form matching Groupon's structure:
1. Welcome → Booking Platform → Category → Description → Website → Business Type → Address → Payment → Review

### What Didn't Work
- **Still too many forms** — we replaced 21 screens with 9 screens. Better, but still fundamentally the same UX pattern.
- **Business setup mixed with deal creation** — the first-time flow combined profile setup and deal creation, which was confusing for returning merchants.
- **No AI in the onboarding** — "Inspire Me" buttons were nice but the core experience was still manual data entry.

---

## Phase 4: Conversational AI Pivot (Day 4)

### The Breakthrough
Realized we were building "forms with AI buttons" instead of "AI with optional forms."

### New Approach: Tell Your Story
Created a conversational interface where Sofia tells her story in natural language (text or voice). The AI extracts everything in one call.

**Before**: 9 form screens → Sofia types each field
**After**: 1 chat → Sofia talks → AI extracts all fields → she reviews

### Story Extractor Endpoint
New Claude Sonnet endpoint that takes free-form text and returns structured JSON:
- Business name, description, location, category (with confidence)
- Services with prices
- Scheduling insights, highlights, business type
- Missing fields + targeted follow-up questions

### What We Learned
- **Voice input is natural** — Sofia can describe her business faster by talking than typing
- **Follow-up questions matter** — the AI shouldn't just extract what's there; it should ask for what's missing
- **Profile is permanent** — once extracted, the data is saved. She never fills it out again.

---

## Phase 5: Deal Creation Chat (Day 5)

### Extended the Conversational Pattern to Deals
If onboarding works via chat, deal creation should too.

**New flow**: Sofia says "I want to offer my massages at 35% off for 3 months, targeting Tuesdays" → AI generates complete deal → she reviews in the 7-step builder.

### Deal Extractor Endpoint
Uses the saved profile as context. When Sofia says "all of them at 35% off," the AI knows what "all of them" means because it has her services.

### Issues Identified
1. **One-shot extraction didn't ask enough** — AI extracted after one message, missing discount preferences, duration, scheduling.
   - Fix: Added 5-step conversational flow (services → discount → duration → scheduling → terms)

2. **Description repetition** — "Melt away tension" appeared in every service description.
   - Fix: Added "never repeat openings" to prompt, bumped temperature to 0.8.

3. **Highlights returned as JSON** — LLM wrapped bullet points in markdown code fences.
   - Fix: Added `cleanHighlights()` parser that strips fences and parses JSON arrays.

4. **Auto-publish without review** — deals went straight to Active with no merchant review.
   - Fix: Redirected to 7-step builder with all fields pre-filled. Draft/Publish options.

---

## Phase 6: QA and Polish (Day 5-6)

### Bugs Found and Fixed
- Discount % not calculated when services were pre-filled from AI
- Edit button created duplicate deals instead of updating
- Photo upload/drag-drop non-functional
- Save Changes gave no visual feedback
- Benchmark data had UTF-8 encoding issues
- Completion checklist showed incomplete for services that had Groupon pricing

### Design Iterations
1. **Three font attempts**: Bricolage Grotesque → DM Sans + Instrument Serif → Plus Jakarta Sans (settled on one clean font)
2. **Admin panel**: tried "workshop bench" aesthetic, reverted to cleaner version, kept the improvements (dismissible guides, pipeline flow connectors)
3. **Merchant portal**: initially too similar to Groupon's current design. Improved with AI-first features (chat, voice, auto-generation)

---

## Prompt Engineering Iterations

### Story Extractor Prompt

**V1** (too vague):
> "Extract business info from this text."
- Result: Missed services, generic descriptions, no follow-up questions.

**V2** (structured but rigid):
> "Return JSON with fields: business_name, description, location..."
- Result: Better extraction but poor follow-up questions ("What is your business name?" when she already said it).

**V3** (current — contextual and adaptive):
> Detailed schema + rules for inference + "only ask for critically missing fields" + "be conversational, not formal"
- Result: Accurate extraction, natural follow-ups, generates highlights and description even from brief input.

### Deal Generator Prompt

**V1**: Basic template — "Generate a deal with title, description, services."
- Result: Generic titles, no market context, descriptions all sounded the same.

**V2**: Added market benchmark context and rules for pricing.
- Result: Better pricing recommendations but still repetitive copy.

**V3** (current): Added category-specific rules, bundle requirements, per-service descriptions, structured fine print, voucher instructions, confidence scores.
- Result: Comprehensive output covering every field Groupon needs.

### Text Enhancer (Inspire Me)

**Issue**: Temperature 0.6 with massage services → every description started with "Melt away tension."
**Fix**: Bumped to 0.8 for descriptions, added "NEVER start two descriptions with the same opening phrase" to both the system prompt and per-request prompt.
**Result**: More varied openings, though still needs context of other descriptions passed in to fully eliminate repetition.

---

## Phase 7: Complete Merchant Portal (Day 6)

### Built the Full Platform
Expanded from deal generator to complete merchant platform matching Groupon's actual portal:
- 12 sidebar pages: Home, Campaigns, Create Deal, Booking, Voucher List, Customer Reviews, Payments, Reports, Support, Admin, Connections
- Onboarding checklist with progress tracking
- Campaign management with Active/Draft/Inactive status toggle

### What We Learned
- **Completeness matters for credibility** — a half-built portal undermines the AI features. Every page Groupon has needs a counterpart.
- **Mock data should look realistic** — voucher codes, payment amounts, customer names, dates all need to feel real.

---

## Phase 8: QA and Production Polish (Day 7)

### Comprehensive QA Round
Tested every flow end-to-end. Key bugs found and fixed:

1. **Discount % not displaying** — pre-filled services from AI didn't calculate discount. Added `recalcAllDiscounts()` helper applied to all prefill paths.
2. **Edit creates duplicates** — clicking Edit → Publish created new deals. Added PUT `/api/deals/:id` endpoint, builder now detects edit mode.
3. **Highlights as raw JSON** — LLM returned JSON arrays in markdown fences. Added `cleanHighlights()` parser.
4. **Photo upload non-functional** — wired up file picker and drag-drop with visual feedback.
5. **No save feedback** — added success message + auto-redirect after saving.
6. **Checklist items never complete** — added completion tracking via profile API, marks items when pages visited.

### Smart Routing
Added profile-aware routing throughout:
- Landing page CTA: onboarding if new, portal/create if onboarded
- Nav "Create Deal": same smart logic
- Admin "Reset Profile": clears profile + deals for demo walkthroughs

### Connection Credential Dialogs
Each booking platform (Booker, Mindbody, Square, Google Business, Yelp) has a dialog with realistic credential fields:
- API keys with example format placeholders
- Location IDs, Site IDs as needed
- Simulated connect/disconnect with status badges

### Deal Status Management
Campaigns page now has status toggle per deal:
- Active / Draft / Inactive
- PATCH endpoint for status changes
- Edit shows "Save Changes", new deals show "Save as Draft" / "Publish"

---

## Key Architectural Decisions Log

| Decision | Options Considered | Choice | Reasoning |
|----------|-------------------|--------|-----------|
| Backend language | Node.js vs Python | Python (FastAPI) | AI ecosystem, auto-docs, builder fluency |
| LLM provider | Claude vs OpenAI vs both | Claude (architecture supports both) | Reliable structured JSON, tiered pricing |
| Onboarding UX | Form wizard vs Conversational | Conversational | Dramatic reduction in merchant effort |
| Deal creation | Form-first vs Chat-first | Chat → Form for review | AI does the work, merchant confirms |
| Data persistence | Database vs JSON files | JSON files | Prototype-appropriate, no migration overhead |
| Profile vs Deal setup | Combined (like Groupon) vs Separate | Separate with first-time combo | Profile is permanent, deals are repeatable |
