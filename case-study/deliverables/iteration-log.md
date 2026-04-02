# Iteration Log

*Development journal documenting the evolution from initial concept to production-ready prototype.*

---

## Phase 1: Research & Initial Architecture (Days 1-2)

### Starting Point
Analyzed the case study brief and identified the core problem: Sofia drops off at deal creation because she's asked to make decisions she has no basis for making. Groupon's 21-screen campaign builder front-loads complexity on a merchant who just wants to get her first deal live.

### First Approach: AI Deal Generator
- 5-question intake form replacing Groupon's 21 screens
- 3-endpoint LLM pipeline: Classifier, Market Intelligence, Deal Generator
- Admin panel for prompt editing (PM can iterate without code changes)
- Deal preview with structured output

### What Worked
- The pipeline architecture was sound -- each endpoint has one job
- Admin panel concept was strong -- non-technical stakeholders can iterate on prompts
- Claude's structured JSON output was reliable from the start

### What We Learned
- Reducing 21 screens to 5 still left Sofia filling out every field manually. The interaction model needed to change, not just the screen count.
- We hadn't yet studied Groupon's actual merchant experience. Any redesign without that baseline would be guesswork.

---

## Phase 2: Product Investigation (Day 3)

### Competitive Deep-Dive
Signed up as an actual Groupon merchant. Documented 27 screenshots of the campaign builder and 12 screenshots of the merchant portal.

### Key Discoveries
1. Groupon's onboarding email link returns a 404
2. Backend returns 502 errors on Step 4 with no user-facing feedback
3. The campaign builder has 21 screens -- far more than our initial 5 questions covered
4. Groupon already has "Inspire Me" buttons -- basic AI assistance exists but is shallow
5. The merchant portal has 12 sidebar pages -- a full management platform, not just a deal creator

### Impact on Architecture
- Created a field-by-field mapping: every field from Groupon's 21 screens mapped to our AI extraction approach
- Expanded scope from "deal generator" to "complete merchant platform" -- a half-built portal would undermine the AI features

---

## Phase 3: Platform Build (Days 3-4)

### Full Merchant Portal
Built all 12 sidebar pages matching Groupon's actual merchant portal:
- Home, Campaigns, Create Deal, Booking, Voucher List, Customer Reviews, Payments, Reports, Support, Admin, Connections

### Business Onboarding (9-Step Flow)
Initially built a traditional step-by-step form matching Groupon's structure:
1. Welcome, Booking Platform, Category, Description, Website, Business Type, Address, Payment, Review

### What We Learned
- Replacing 21 screens with 9 was incremental, not transformative. The UX pattern was still fundamentally manual data entry.
- Combining business setup with deal creation confused the mental model for returning merchants. Profile setup is a one-time activity; deal creation is repeatable.

---

## Phase 4: Conversational AI Pivot (Day 4)

### The Breakthrough
We were building "forms with AI buttons" instead of "AI with optional forms." The interaction model needed to invert: AI does the work, the merchant confirms.

### New Approach: Tell Your Story
Created a conversational interface where Sofia describes her business in natural language (text or voice). The AI extracts all structured fields in a single pass.

**Before**: 9 form screens -- Sofia types each field individually
**After**: 1 conversation -- Sofia talks, AI extracts all fields, she reviews and confirms

### Story Extractor Endpoint
New endpoint that takes free-form text and returns structured JSON:
- Business name, description, location, category (with confidence scores)
- Services with prices
- Scheduling insights, highlights, business type
- Missing fields + targeted follow-up questions

### What We Learned
- Voice input is natural for this use case -- Sofia can describe her business faster by talking than typing
- Follow-up questions matter -- the AI shouldn't just extract what's present; it should identify what's missing and ask contextual questions
- Profile data is permanent -- once extracted, she never fills it out again

---

## Phase 5: Deal Creation Chat (Day 5)

### Extended the Conversational Pattern to Deals
If onboarding works via chat, deal creation should too.

**New flow**: Sofia says "I want to offer my massages at 35% off for 3 months, targeting Tuesdays" -- the AI generates a complete deal using her saved profile as context, then she reviews it in the 7-step builder.

### Deal Extractor Endpoint
Uses the saved business profile as context. When Sofia says "all of them at 35% off," the AI knows what "all of them" means because it already has her service catalog.

### Issues Discovered Through Testing
1. **Single-turn extraction was insufficient** -- the AI extracted after one message, missing discount preferences, duration, and scheduling constraints.
   - Solution: Implemented a 5-step conversational flow (services, discount, duration, scheduling, terms)

2. **Description repetition** -- "Melt away tension" appeared in every service description at temperature 0.6.
   - Solution: Increased temperature to 0.8, added explicit prompt rules against repeated openings.

3. **Highlights returned as raw JSON** -- the LLM wrapped bullet points in markdown code fences.
   - Solution: Added `cleanHighlights()` parser that strips fences and parses JSON arrays.

4. **Auto-publish without review** -- deals went straight to Active with no merchant confirmation.
   - Solution: Redirected to 7-step builder with all fields pre-filled. Added Draft/Publish options so the merchant retains control.

---

## Phase 6: QA & Validation (Days 6-7)

### Comprehensive End-to-End Testing
Tested every flow end-to-end across onboarding, deal creation, editing, and portal navigation. Key issues found and resolved:

1. **Discount calculation** -- pre-filled services from AI didn't trigger discount percentage calculation. Added `recalcAllDiscounts()` helper applied to all prefill paths.
2. **Edit creates duplicates** -- clicking Edit then Publish created new deals instead of updating. Added PUT `/api/deals/:id` endpoint; builder now detects edit mode.
3. **Photo upload persistence** -- wired up file picker and drag-drop with visual feedback. Backend upload endpoint saves files to server and serves as static assets. Uploaded photos persist across profile and deal preview.
4. **Session state on refresh** -- onboarding state now survives page refresh so merchants don't lose progress.
5. **Deal chat multi-field parsing** -- improved extraction reliability when merchants describe multiple services and constraints in a single message.
6. **No save feedback** -- added success confirmation message and auto-redirect after saving.
7. **Checklist completion tracking** -- added completion tracking via profile API; marks items complete when relevant pages are visited.

### Address & Phone Validation
Made full street address and phone number required fields in onboarding. Updated the Story Extractor prompt to generate targeted follow-up questions if these are missing from the merchant's initial description. This ensures voucher redemption info is always captured during the conversational flow rather than as an afterthought.

### Smart Routing
Added profile-aware routing throughout:
- Landing page CTA: routes to onboarding if new, portal if onboarded
- Nav "Create Deal": same smart logic
- Admin "Reset Profile": clears profile and deals for demo walkthroughs

---

## Phase 7: Polish & Production Readiness (Day 8)

### Design Iterations
1. **Typography**: Tested Bricolage Grotesque, DM Sans + Instrument Serif, and Plus Jakarta Sans. Settled on a single clean font for consistency.
2. **Admin panel**: Iterated on visual hierarchy -- added dismissible guides, pipeline flow connectors, cleaner layout.
3. **Merchant portal**: Differentiated from Groupon's current design by emphasizing AI-first features (chat, voice, auto-generation).

### Unicode & Data Cleanup
Resolved UTF-8 encoding issues in benchmark data. Cleaned up tooltip content and placeholder text across the portal.

### Dead Code Removal & Code Review
Full code review pass: removed unused components, consolidated duplicate logic, fixed route ordering issues, resolved hardcoded URLs, and added error boundaries.

### Connection Credential Dialogs
Each booking platform (Booker, Mindbody, Square, Google Business, Yelp) has a dialog with realistic credential fields -- API keys with example format placeholders, Location IDs, simulated connect/disconnect with status badges.

### Mobile Responsiveness
Added full mobile responsiveness:
- Hamburger menus replace sidebar navigation on small screens
- Responsive grids reflow from multi-column to single-column
- Collapsible sidebar with mobile overlay
- Touch-friendly controls and spacing

### What We Learned
- Mobile responsiveness is table stakes -- a merchant platform that doesn't work on Sofia's phone between clients misses the core use case.
- Required fields in conversational AI need explicit prompt rules -- without telling the AI that phone/address are mandatory, it treated them as optional.

---

## Prompt Engineering Iterations

### Story Extractor Prompt

**V1** (too vague):
> "Extract business info from this text."
- Result: Missed services, generic descriptions, no follow-up questions.

**V2** (structured but rigid):
> "Return JSON with fields: business_name, description, location..."
- Result: Better extraction but poor follow-up questions ("What is your business name?" when she already said it).

**V3** (contextual and adaptive):
> Detailed schema + inference rules + "only ask for critically missing fields" + conversational tone
- Result: Accurate extraction, natural follow-ups, generates highlights and description even from brief input.

### Deal Generator Prompt

**V1**: Basic template -- "Generate a deal with title, description, services."
- Result: Generic titles, no market context, descriptions all sounded the same.

**V2**: Added market benchmark context and pricing rules.
- Result: Better pricing recommendations but still repetitive copy.

**V3** (current): Added category-specific rules, bundle requirements, per-service descriptions, structured fine print, voucher instructions, confidence scores.
- Result: Comprehensive output covering every field Groupon needs.

### Text Enhancer (Inspire Me)

**Issue**: Temperature 0.6 with massage services produced every description starting with "Melt away tension."
**Fix**: Increased to 0.8 for descriptions, added "NEVER start two descriptions with the same opening phrase" to both system prompt and per-request prompt.
**Result**: More varied openings. Full elimination of repetition requires passing context of other descriptions, which is a future enhancement.

---

## Key Architectural Decisions

| Decision | Options Considered | Choice | Reasoning |
|----------|-------------------|--------|-----------|
| Backend language | Node.js vs Python | Python (FastAPI) | AI ecosystem, auto-generated docs, team fluency |
| LLM provider | Claude vs OpenAI vs both | Claude (architecture supports swapping) | Reliable structured JSON, tiered model pricing |
| Onboarding UX | Form wizard vs Conversational | Conversational | Dramatic reduction in merchant effort |
| Deal creation | Form-first vs Chat-first | Chat then form for review | AI does the work, merchant confirms |
| Data persistence | Database vs JSON files | JSON files | Prototype-appropriate, zero migration overhead |
| Profile vs Deal setup | Combined (like Groupon) vs Separate | Separate with first-time combination | Profile is permanent, deals are repeatable |
