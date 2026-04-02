# Case Study: AI-Powered Merchant Deal Creator for Groupon

*Author: Greata Li | April 2026*

---

## 1. The Problem

Groupon's merchant onboarding has a critical drop-off at deal creation. A merchant like Sofia - small business owner, 12 years experience, loyal regulars, slow mid-week - finds Groupon, signs up, and stalls. She needs to choose services, set pricing, write copy, pick categories, and upload photos. She's not a marketer. She has 20 minutes between clients. She doesn't know what works on Groupon.

### What We Found (First-Hand Investigation)

We signed up as a Groupon merchant and documented the actual experience:

- **The onboarding email link was broken** - the first link Sofia clicks after approval returns a 404 page. She has to figure out password reset as a workaround.
- **The campaign builder has 21+ screens** - booking platform, 3-level category selection, template selection, service options with pricing, photos, highlights, description, fine print, voucher instructions, business info (description, website, type), payment info, tax compliance, review, submit.
- **Backend infrastructure issues** - we observed 502 errors, JSON parse failures, and silent failures in the merchant portal (documented with console logs).
- **No AI assistance** - every field requires manual input. "Inspire Me" buttons exist for highlights and descriptions but produce generic results.
- **Irreversible actions** - "Once you submit, you won't be able to change it" warnings on draft forms.

The problem isn't just the form. The problem is that **Sofia is being asked to make 30+ decisions she has no basis for making** - what discount to set, what copy to write, what category to pick, what fine print to include.

### The Job To Be Done

"Help me get new customers in my chair this week - without me having to figure out how Groupon works."

---

## 2. Success Metrics (Defined Before the Solution)

### Primary Metric
**Deal creation completion rate** - % of merchants who start and successfully publish a live deal.

| Metric | Assumed Baseline | Target | Rationale |
|--------|-----------------|--------|-----------|
| Deal creation completion rate | ~30% | 60%+ | If Sofia can't get a deal live, nothing else matters |
| Time to first live deal | 45-60 minutes | Under 10 minutes | Sofia has 20 minutes between clients |
| Deal quality score (AI fields accepted without edit) | N/A | 70%+ | Measures whether AI generates good content, not just fills blanks |
| First deal performance (GP30) | Varies by category | Match or beat category average | Did Sofia's deal actually work? |

### Counter-Metric (What to Watch For)
**Deal quality score** - we don't want to increase completion at the cost of bad deals. If AI-generated deals have high acceptance rates (merchants publish without editing) but low conversion rates (customers don't buy), we're optimizing for the wrong thing. The AI is writing deals that sound good to Sofia but don't convert. That's the most dangerous failure mode.

### What We Explicitly Do NOT Measure
- Form field completion rate (vanity metric - completing a form is not success)
- Time spent on platform (more time = more friction, not engagement)
- Number of AI suggestions shown (activity metric, not outcome metric)

---

## 3. The Solution

### 3.1 Concept

Instead of asking Sofia to fill out 21 screens of forms, we ask her to **tell us about her business in her own words**. The AI extracts everything - business name, category, services with prices, location, highlights, scheduling insights - from a single conversational interaction. She reviews, adjusts, and publishes.

**Sofia provides what she knows. The AI provides what Groupon knows.**

### 3.2 What We Built

A complete merchant platform with three experiences:

#### A. Conversational Business Onboarding (first-time, one-time)
- Chat/voice interface: "Tell me about your business"
- AI extracts structured profile from natural language (business name, category, services, prices, location, hours, scheduling insights)
- Follow-up questions for missing critical info (full street address and phone number are required - AI asks targeted follow-ups if missing)
- Profile review page with all extracted fields editable + live customer preview
- Flows directly into first deal creation

#### B. AI-Assisted Deal Creation (repeatable)
- Conversational chat: "What deal do you want to run?" (services pre-loaded from profile)
- AI asks targeted follow-ups: discount %, duration, scheduling, special terms
- Generates complete deal: title, highlights, per-service descriptions, pricing, fine print, voucher instructions
- 7-step review builder for fine-tuning (Services & Pricing → Photos → Highlights → Description → Fine Print → Voucher → Review & Publish)
- Live customer preview sidebar that updates as merchant edits
- "Inspire Me" + Voice Dictation on every text field

#### C. Merchant Portal (management dashboard)
Full sidebar navigation matching Groupon's actual merchant portal:
- **Home**: Onboarding checklist, progress tracker, campaign summary
- **Campaigns**: Active/Drafts with status toggle (Active/Draft/Inactive), edit, preview, delete
- **Create Deal**: AI-assisted deal creation flow
- **Booking**: Integration with Booker, Mindbody, Square (connection dialogs with credential fields)
- **Voucher List**: Filterable table with status badges
- **Customer Reviews**: Rating stats, AI-suggested response button
- **Payments**: Payout tracking with expandable detail views (gross, commission, net)
- **Reports**: Downloadable CSV reports with mock data
- **Support**: Knowledge base + AI chatbot assistant
- **Connections**: Platform integrations with credential management
- **Profile**: Business info management

#### D. Pipeline Admin Panel (PM's workbench)
- **7 configurable LLM endpoints**: Business Classifier, Service Suggester, Market Intelligence, Deal Generator, Story Extractor, Deal Extractor, Text Enhancer
- **Model selector**: Dropdown to switch Claude Haiku / Sonnet / Opus per endpoint
- **Prompt editor**: Edit system prompts, temperature, max tokens without code changes
- **Test panel**: Run any endpoint with custom input, compare outputs across runs
- **Benchmark data**: Synthetic market intelligence with stated assumptions
- **Analytics**: Pipeline run stats, per-endpoint latency, API costs, field acceptance rates

### 3.3 Architecture

**AI Pipeline (7 endpoints):**

| Endpoint | Model | Purpose | Latency |
|----------|-------|---------|---------|
| Business Classifier | Haiku | Categorize business from description | ~1-2s |
| Service Suggester | Haiku | Suggest services with typical prices | ~1-2s |
| Market Intelligence | Haiku | Recommend discount depth and deal structure | ~1-2s |
| Deal Generator | Sonnet | Create complete deal as structured JSON | ~3-5s |
| Story Extractor | Sonnet | Parse natural language into structured profile | ~2-3s |
| Deal Extractor | Sonnet | Parse deal description into structured deal data | ~2-3s |
| Text Enhancer | Haiku | "Inspire Me" copywriting for any field | ~1s |

All prompts are configurable via the admin panel. A PM can change model selection, temperature, and prompt text without touching code.

**Tech Stack:**

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Frontend | React + TypeScript + Vite | Modern, type-safe, fast dev server |
| Styling | Tailwind CSS + shadcn/ui | Customizable, Plus Jakarta Sans typography |
| Backend | Python + FastAPI | AI/data ecosystem, auto-generated API docs at /docs |
| LLM | Claude API (Anthropic) | Reliable structured JSON output, tiered pricing (Haiku for fast tasks, Sonnet for complex generation) |
| Data | JSON file store | Prototype-appropriate - profile, deals, configs persist across restarts |

### 3.4 Mobile Responsive Design

The entire platform is mobile responsive: hamburger menus on small screens, responsive grids that reflow from multi-column to single-column, collapsible sidebar navigation, and touch-friendly controls. Works on phone, tablet, and desktop.

### 3.5 What's Fully Functional vs. Mockup

| Feature | Status | Notes |
|---------|--------|-------|
| Conversational onboarding (chat + voice) | **Fully functional** | Real Claude API calls, voice via Web Speech API |
| AI deal creation (chat → builder) | **Fully functional** | Multi-turn conversation, pre-fills all 7 steps |
| Smart routing (new vs returning merchant) | **Fully functional** | Checks profile, routes to onboarding or deal creation |
| Deal publishing + persistence | **Fully functional** | JSON file store, persists across restarts |
| Deal editing (update existing) | **Fully functional** | PUT endpoint, "Save Changes" vs "Publish" |
| Deal status toggle (Active/Draft/Inactive) | **Fully functional** | PATCH endpoint, toggle on campaigns page |
| Customer preview | **Fully functional** | Mirrors Groupon deal page layout |
| Admin prompt editor + test panel | **Fully functional** | Model dropdown (Haiku/Sonnet/Opus), changes take effect immediately |
| Admin analytics dashboard | **Fully functional** | Pipeline stats, costs, field acceptance rates |
| Admin reset profile (demo tool) | **Fully functional** | Resets merchant profile + deals for demo walkthroughs |
| Onboarding checklist tracking | **Fully functional** | Marks items complete as merchant visits pages |
| Voucher list, reviews, payments | **Mock data** | Realistic mock data, UI fully interactive |
| Payment drill-down | **Fully functional** | Expandable rows showing gross, commission, net breakdown |
| CSV report download | **Fully functional** | Generates real CSV files with mock data |
| Booking platform connections | **Simulated** | Credential dialogs with realistic API key fields (Booker, Mindbody, Square) |
| Photo upload | **Functional** | Uploads to server, persists in profile, served as static files |
| Customer reviews AI response | **Simulated** | AI generates suggested responses, not connected to real review system |
| AI chatbot (support) | **Simulated** | Simulated responses, not connected to LLM |
| API documentation | **Fully functional** | Auto-generated Swagger UI at /docs, linked from admin panel |

---

## 4. How We'd Measure Success in Production

### Week 1-2: Pipeline Quality
- What % of generated deals does Sofia publish without editing? (acceptance rate)
- Which fields does she edit most? (indicates where AI is weakest)
- Average time from onboarding start to deal published
- Conversational vs. manual intake usage rate

### Week 3-4: Deal Performance
- How do AI-generated deals perform vs. manually created deals? (views, purchases, GP30)
- Do AI-assisted merchants have higher first-deal success rates?
- What's the correlation between acceptance rate and deal performance?

### Key Monitoring
- **Pipeline latency**: end-to-end from story submission to deal generation
- **Token usage and cost**: per endpoint, per deal generated
- **Field acceptance rate**: which AI-generated fields merchants accept vs. edit
- **Error rate**: JSON parse failures, empty responses, timeouts

---

## 5. What We Would Change or Kill After Production

### Kill
- **Force-classified categories** if accuracy is below 80%. Switch to hybrid: AI suggests top 3, merchant picks.
- **One-shot story extraction** if follow-up rate is too high. May need a more structured conversational flow for certain business types.

### Change
- **Discount recommendations** based on actual deal performance data, not synthetic benchmarks.
- **Description variety**: current Inspire Me produces similar openings across services. Pass all existing descriptions as context so each is unique.
- **Photo handling**: server-side upload is functional; next step is AI-powered suggestions for positioning and quality.

### Watch
- **High acceptance + low conversion** = the most dangerous failure mode. The AI writes deals that sound good to Sofia but don't convert. Need to correlate acceptance rate with actual deal performance.
- **Conversational intake abandonment**: if merchants start the chat but don't finish, the conversational approach may not work for all personality types. Keep the manual "Set up manually" option prominent.

---

## 6. What We Explicitly Did Not Build (and Why)

| What We Cut | Why |
|-------------|-----|
| Real booking platform OAuth | No access to Booker/Mindbody/Square APIs. Showed credential dialogs to demonstrate the capability. |
| AI image generation | Photos require real business photos for authenticity. We provide guidance and upload capability instead. |
| Post-publish deal optimization | Auto-adjusting discount or refreshing copy after publish is V2. We optimize at creation time. |
| Multi-language support | English only for prototype. |
| Real payment processing | No merchant agreement in place. Showed the payment UI and payout tracking with mock data. |
| Returning merchant optimization flow | This solves first deal creation. Returning merchants who want to modify deals use the edit flow. |
| Real-time deal analytics | Would require Groupon's actual performance data pipeline. Showed mock analytics to demonstrate the concept. |

---

## 7. Technical Decisions and Reasoning

Documented in [decisions.md](./decisions.md). Key decisions:

1. **Python over Node.js** - AI/data ecosystem, builder fluency, FastAPI auto-docs. Trade: two languages in the stack.
2. **Claude over OpenAI** - reliable structured JSON, tiered pricing (Haiku/Sonnet). Architecture supports swapping.
3. **Tailwind + shadcn over MUI** - customizable for two distinct UIs (merchant + admin), AI coding tools generate better Tailwind.
4. **Conversational intake over form wizard** - fundamental UX shift. Sofia talks, AI extracts. Reduces 21 screens to 1 conversation.
5. **JSON file store over database** - prototype-appropriate. Deals, profiles, configs persist. No migration overhead.

---

## 8. Prompt Engineering and Iteration

### Story Extractor
The most critical prompt in the system. Evolved through iteration:

**V1**: Simple extraction - "extract business info from this text." Problem: missed services, poor category classification.

**V2**: Added structured JSON schema with explicit field list. Problem: follow-up questions were too broad.

**V3 (current)**: Added rules for when to ask follow-ups (only for critical missing fields), inference for non-critical fields, and confidence scoring for categories. Business descriptions are auto-generated even from brief input.

### Deal Generator
**Key tuning**: Temperature at 0.5 (balanced between creativity and consistency). Lower temperatures produced repetitive titles. Higher temperatures produced inconsistent pricing.

### Text Enhancer (Inspire Me)
**Problem identified**: All service descriptions started with "Melt away tension" for massage services.
**Fix**: Added "NEVER start two descriptions with the same opening phrase" to the system prompt, bumped temperature to 0.8 for descriptions (higher variety), and plan to pass all existing descriptions as context.

### Observations on Model Selection
- **Haiku** for classification and fast tasks: adequate quality, 3-5x cheaper, sub-2s latency
- **Sonnet** for generation and extraction: significantly better at structured JSON output, handles complex multi-field extraction
- The admin panel's model dropdown lets a PM A/B test models per endpoint - this is a real operational advantage

---

## 9. Product Investigation Findings

### Real Bugs in Groupon's Current Merchant Flow

1. **Broken onboarding email link** (Critical) - the account creation URL returns 404. Merchants must use password reset as a workaround.
2. **502 Backend errors on Step 4** - the "Complete the form" button silently fails. Console shows `502 Bad Gateway` on the messages API. No error shown to merchant.
3. **Silent failures** - multiple frontend JavaScript errors (FullStory init called 4x, Bloodhound widget errors) with no user-facing feedback.

### Flow Analysis (27 Screenshots)
Complete field-by-field mapping documented in [flow-mapping.md](flow-mapping.md). Every field Groupon collects across 21 screens was mapped to our AI-assisted approach. Result: zero fields skipped, all handled by AI or smart defaults.

---

## 10. Deliverables

- [x] Working prototype: conversational onboarding → AI deal creation → merchant portal
- [x] Admin panel: 7 endpoint configs, prompt editor, test panel, analytics
- [x] Synthetic market data for Beauty & Spas / Chicago
- [x] Product documentation (this document)
- [x] Decision log with reasoning ([decisions.md](./decisions.md))
- [x] Flow mapping: Groupon's 21 screens → our approach ([flow-mapping.md](flow-mapping.md))
- [x] Real-world findings from Groupon investigation ([findings.md](findings.md))
- [x] Video walkthrough script ([video-script.md](video-script.md))
- [x] Iteration log ([iteration-log.md](iteration-log.md))
