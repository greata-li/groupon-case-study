# PRD: AI-Powered Merchant Deal Creator for Groupon

*Author: Greata Li | Date: March 2026*

---

## 1. Problem Statement

Groupon's merchant onboarding funnel has a critical drop-off at deal creation. A merchant like Sofia - small business owner, 12 years experience, loyal regulars, slow mid-week - finds Groupon, starts the sign-up flow, and stalls. She needs to choose services, set pricing, write copy, pick categories, and upload photos. She's not a marketer. She has 20 minutes between clients. She doesn't know what works on Groupon.

Sofia drops off. Groupon lost the merchant. She never fills her Tuesdays.

The problem isn't the form. The problem is that Sofia is being asked to make decisions she has no basis for making.

---

## 2. Job To Be Done

"Help me get new customers in my chair this week - without me having to figure out how Groupon works."

---

## 3. Success Metrics (defined BEFORE the solution)

### Primary Metric
**Deal creation completion rate** - % of merchants who start deal creation and successfully publish a live deal.

- **Assumed baseline:** ~30% (most merchants stall at deal creation based on the problem description)
- **Target:** 60%+ with AI-assisted flow
- **Why this metric:** If Sofia can't get a deal live, nothing else matters. No deal = no customers = no value for either side.

### Secondary Metrics

| Metric | Baseline (assumed) | Target | Why it matters |
|--------|-------------------|--------|---------------|
| Time to first live deal | 45-60 min | Under 10 min | Sofia has 20 minutes. If it takes longer, she won't finish. |
| Deal quality score | N/A (new) | 70%+ of AI-generated fields accepted without edit | Measures whether the AI is actually generating good content, not just filling blanks. |
| First deal performance (GP30) | Varies by category | Match or beat category average | The ultimate measure. Did Sofia's deal actually work? Not just "did she complete the form" but "did she get customers." |
| Merchant return rate | Unknown | 40%+ create a second deal within 60 days | If the first deal works, she comes back. If not, we lost her anyway. |

### What we explicitly do NOT measure
- Form field completion rate (vanity - completing a form is not success)
- Time spent on platform (more time = more friction, not engagement)
- Number of AI suggestions shown (activity metric, not outcome metric)

---

## 4. User Research Assumptions

*Stated explicitly per case study rules. These would be validated with real merchant data in production.*

| Assumption | Basis |
|-----------|-------|
| Sofia doesn't know what discount depth works for her category | Stated in the brief: "She doesn't know what deals perform in her city or category" |
| Sofia can answer simple questions about her own business in under 2 minutes | She's been running this business for 12 years. She knows her services and prices. |
| If Sofia sees a complete deal that looks professional, she'll trust it more than a blank form | Reducing decisions reduces friction. A strong default she can edit is better than a blank canvas. |
| The biggest drop-off is at the "what do I write / what price do I set" decision point, not at account creation | The brief says she "gets to the point where she needs to create her first deal" then stalls |
| Deals that match category benchmarks (discount depth, title format, description length) outperform generic ones | Standard marketplace pattern - data-informed defaults outperform user guesses |
| Sofia needs to feel in control - AI generates, she approves | Merchants won't trust a system that publishes automatically. Review step is non-negotiable. |

---

## 5. Solution: AI Deal Creator

### 5.1 Concept

Instead of asking Sofia to fill out a complicated form, we ask her 5 simple questions about her business. The AI generates a complete, publish-ready deal. Sofia reviews, edits if she wants, and publishes.

Sofia provides what she knows. The AI provides what Groupon knows.

### 5.2 User Flow (Sofia's Experience)

```
Step 1: Welcome
   "Let's get your first deal live. I just need a few details about your business."

Step 2: Business Intake (5 questions, ~2 minutes)
   1. What's your business name?
   2. What do you do? (e.g., "waxing and lash services")
   3. Where are you located? (city/neighborhood)
   4. What services do you want to offer? What do you normally charge?
   5. Anything else customers should know? (optional - hours, experience, specialties)

Step 3: AI generates complete deal (~5-10 seconds)
   - Deal title
   - Description with selling points
   - Service options with pricing and recommended discount
   - Category (auto-detected)
   - Fine print (generated from templates + business context)
   - Scheduling recommendation ("Best for: Tuesday & Wednesday bookings")
   - Photo guidance ("Upload a photo of your studio - deals with photos convert 2x better")

Step 4: Deal Preview & Review
   Sofia sees her deal exactly as customers would see it.
   Every field is editable. AI-generated fields are marked with a subtle indicator.
   Confidence flags: if the AI is uncertain about a field, it's highlighted for review.

Step 5: Publish
   One click. Deal goes live.
   "Your deal is live! Here's what to expect in the first 48 hours."
```

### 5.3 AI Pipeline Architecture

```
Sofia's input (5 fields)
        |
        v
[Endpoint 1: Business Classifier]
   Input: business description + location
   Output: category, subcategory, service tags, business type
   Model: GPT-4o-mini (fast, cheap, classification task)
   Heuristic fallback: if confidence < 80%, present top 3 categories for Sofia to pick
        |
        v
[Endpoint 2: Market Intelligence]
   Input: category + location + services + prices
   Output: recommended discount %, price positioning, deal structure advice
   Source: synthetic benchmark data (what works for this category/city)
   Note: In production, this pulls from Groupon's actual deal performance data
   This endpoint can be heuristic-only (lookup table) or LLM-assisted
        |
        v
[Endpoint 3: Deal Generator]
   Input: Sofia's raw input + classified category + market recommendations
   Output: complete deal as structured JSON:
     {
       title: "Brazilian Wax or Lash Lift at Sofia's Studio (Up to 40% Off)",
       description: "12 years of experience in a cozy two-chair studio...",
       fine_print: "New customers only. Valid Tuesday-Wednesday. By appointment.",
       services: [
         { name: "Brazilian Wax", original: 65, discount_pct: 40, deal_price: 39 },
         { name: "Lash Lift", original: 85, discount_pct: 35, deal_price: 55 },
         { name: "Wax + Lash Bundle", original: 150, discount_pct: 40, deal_price: 90 }
       ],
       category: "Beauty & Spas > Waxing",
       scheduling: "Best for filling Tuesday/Wednesday slots",
       photo_guidance: "Upload a photo of your studio. Deals with photos convert 2x.",
       confidence: { title: 0.92, description: 0.88, pricing: 0.85, category: 0.95 }
     }
   Model: Claude Sonnet or GPT-4o (needs quality generation)
        |
        v
[Sofia reviews in Deal Preview UI]
        |
        v
[Optional - Endpoint 4: Deal Optimizer]
   Triggered when Sofia edits a field
   Input: Sofia's edit + original AI recommendation + benchmarks
   Output: gentle suggestion if her edit might hurt performance
   Example: "You changed the discount to 20%. Deals under 30% in Beauty & Spas
            typically get 60% fewer views. Want to keep it at 35%?"
   Model: GPT-4o-mini (fast nudge, not heavy generation)
```

### 5.4 Admin/PM Experience

A separate admin interface for the product team to manage the AI pipeline:

| Feature | What it does |
|---------|-------------|
| Endpoint list | See all LLM endpoints in the pipeline with status, model, avg latency |
| Prompt editor | Click into any endpoint. See and edit the system prompt, model selection, temperature. |
| Test panel | Run any endpoint with sample input and see the output. Iterate without deploying code. |
| Benchmark data editor | View and update the market intelligence data (category benchmarks, city data) |

This is not just a developer tool. It's designed so a PM can tweak prompts and test outputs without touching code. Shows operational maturity - the system is maintainable, not a black box.

---

## 6. What We Explicitly Did NOT Build (and Why)

| What we cut | Why |
|-------------|-----|
| Photo upload and AI image generation | Photos matter for conversion, but the AI can't take a photo of Sofia's studio. We provide guidance instead. In V2, we could generate a placeholder or enhance uploaded photos. |
| Integration with Groupon's real merchant platform | We don't have access. The prototype uses synthetic data and standalone UI. In production, this would plug into Campaign Manager. |
| Returning merchant experience | This solves first deal creation only. Returning merchants who want to modify or create additional deals would need a different flow. |
| Automated deal optimization post-publish | We generate and suggest at creation time. Post-publish optimization (auto-adjusting discount, refreshing copy) is V2. |
| Multi-language support | English only for the prototype. |
| Real market data | Using synthetic benchmarks. In production, this would pull from Groupon's actual deal performance data by category and city. |

---

## 7. Technical Approach

### Stack
- **Frontend:** React + TypeScript (built with Claude Code / Loveable)
- **Backend:** Node.js or Python API
- **LLM:** Claude API or OpenAI API (configurable per endpoint)
- **Data:** JSON file with synthetic market benchmarks
- **Admin:** React admin panel for prompt management and testing

### Prototype Scope
- Working intake → generation → preview → publish flow
- Admin panel with prompt editor and test functionality
- 3-4 configurable LLM endpoints
- Synthetic benchmark data for Beauty & Spas in Chicago

### What "working" means
- Sofia can input her business details
- AI generates a complete deal with all fields populated
- Sofia can review and edit the deal in a preview that looks like a real deal listing
- The admin can see and edit prompts, test endpoints, and see outputs
- The pipeline is configurable - changing a prompt in the admin changes the output

---

## 8. Evaluation Plan (Post-Launch)

If this were in production, here's how we'd know it's working:

### Week 1-2: Pipeline quality
- What % of generated deals does Sofia publish without editing? (acceptance rate)
- Which fields does she edit most? (indicates where the AI is weakest)
- What's the average time from intake start to deal published?

### Week 3-4: Deal performance
- How do AI-generated deals perform vs. manually created deals? (views, purchases, GP30)
- Do AI-assisted merchants have higher first-deal success rates?
- What's the correlation between acceptance rate and deal performance?

### What we'd change or kill
- **Kill:** If merchants consistently override the discount recommendation, the market intelligence is wrong. Fix the data, not the prompt.
- **Change:** If the category classifier is wrong more than 20% of the time, switch to a hybrid: AI suggests top 3, Sofia picks. Don't force an AI answer when confidence is low.
- **Watch:** If deal quality score is high (merchants accept) but deal performance is low (customers don't buy), we're optimizing for the wrong thing. The AI is writing deals that sound good to Sofia but don't convert. That's the most dangerous failure mode.

---

## 9. Assumptions Log

| # | Assumption | Impact if wrong | How to validate |
|---|-----------|----------------|----------------|
| 1 | 30% baseline completion rate | Metrics targets are wrong | Pull actual Groupon funnel data |
| 2 | 5 questions is enough to generate a good deal | Need more intake = more friction | Test with real merchants, measure acceptance rate |
| 3 | 35-40% discount is optimal for beauty services | Bad pricing = bad merchant outcomes | A/B test discount recommendations by category |
| 4 | Merchants trust AI-generated content | Low acceptance rate if not | Measure edit rate, add "why" tooltips to build trust |
| 5 | Time-to-publish is the key friction driver | Maybe it's trust, not time | Survey merchants who drop off |
| 6 | Category can be auto-detected from business description | Misclassification kills discoverability | Measure classifier accuracy, add fallback |

---

## 10. Deliverables Checklist

- [ ] Working prototype: intake → AI generation → deal preview → publish
- [ ] Admin panel: endpoint list, prompt editor, test panel
- [ ] Synthetic market data for Beauty & Spas / Chicago
- [ ] PRD document (this document)
- [ ] Video walkthrough script
- [ ] Video recording (under 10 minutes)
- [ ] Iteration log: prompts tried, what broke, what changed

---

## 11. Video Walkthrough Structure

*Per the case study requirements, in this order:*

1. **What I built and why** (~2 min)
   - Show the prototype. Walk through Sofia's experience.
   - Explain: "The form is the problem. Sofia shouldn't navigate Groupon. The AI should do the work."

2. **How I measure success** (~2 min)
   - Define metrics BEFORE showing the solution in detail.
   - Primary: deal creation completion rate (30% → 60%+)
   - Secondary: time to first deal, deal quality score, GP30 performance
   - "I don't measure form completion. I measure whether Sofia gets customers."

3. **What I'd change or kill after production** (~2 min)
   - Kill: force-classified categories if accuracy is below 80%
   - Change: discount recommendations based on actual performance data
   - Watch: high acceptance + low conversion = the most dangerous failure mode

4. **What I didn't build and why** (~1 min)
   - Photo generation, real Groupon integration, returning merchant flow, post-publish optimization
   - "Scope discipline. These are V2. The first thing that matters is: can Sofia get a deal live?"

5. **Show the admin / iteration process** (~2 min)
   - Show prompt editor, test panel
   - Show an example of iterating on a prompt and how the output changed
   - "This is how a PM maintains this system without touching code."
