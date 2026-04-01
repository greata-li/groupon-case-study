# Conversational Intake Plan — AI-First Merchant Onboarding

*The core insight: Sofia tells her story once. The AI does the rest.*

---

## The Problem with What We Built

We built forms with AI buttons. That's not AI-assisted onboarding — that's a form.

Real AI-assisted onboarding means: **Sofia talks, the system listens, and everything gets filled in automatically.** She reviews and adjusts, not types and submits.

---

## The New Flow

### Phase 1: Tell Your Story (First-Time Onboarding)

**Single screen. Conversational interface.**

Sofia sees a clean chat-like interface:

> "Welcome to Groupon! Tell me about your business — what you do, where you are, what services you offer, and what you charge. You can type or use voice."

Sofia speaks or types:
> "I'm Sofia, I run a waxing and lash studio called Sofia's Studio in Lincoln Park, Chicago. Been doing this 12 years. I have two chairs. I do Brazilian waxes for $65, lash lifts for $85, and a wax + lash bundle for $140. My regulars love me but Tuesdays and Wednesdays are always slow."

**The AI calls a new "story extractor" endpoint that returns:**

```json
{
  "business_name": "Sofia's Studio",
  "business_description": "Two-chair waxing and lash studio in Lincoln Park with 12 years of experience. Known for loyal regulars and personalized service.",
  "location": "Lincoln Park, Chicago",
  "category": "Health, Beauty & Wellness > Waxing",
  "services": [
    { "name": "Brazilian Wax", "price": 65 },
    { "name": "Lash Lift", "price": 85 },
    { "name": "Wax + Lash Bundle", "price": 140 }
  ],
  "scheduling_insight": "Slow Tuesdays and Wednesdays — ideal for Groupon deal scheduling",
  "experience_years": 12,
  "business_type": "sole_provider",
  "extracted_fields": ["business_name", "business_description", "location", "category", "services", "scheduling_insight", "experience_years"]
}
```

**If the AI needs more info, it asks follow-up questions:**
> "Got it! A few quick things I couldn't catch:
> - What's your phone number for customer bookings?
> - What's your full street address?
> - Do you have a website?"

Sofia answers. Done.

### Phase 2: Review Your Profile

**Single page showing everything the AI extracted, organized into sections:**

- Business Info: name, description (editable), category (with AI confidence), location, contact
- Services: table with name + price (editable, add/remove)
- Scheduling: when to target deals
- Business Type: auto-detected, changeable

Every field is pre-filled. Sofia scans, maybe tweaks one thing, clicks "Save Profile."

**This profile is permanently saved.** She never fills this out again.

### Phase 3: Create a Deal (Repeatable)

**Starts from the saved profile.** No business name, no description, no category — those are known.

The deal creation flow is:

1. **Which services?** Shows her saved services. She checks the ones she wants to include in this deal. Can add new ones.
2. **AI generates the deal** — calls the pipeline with her profile + selected services. Returns: title, highlights, per-option descriptions, pricing (with market-recommended discounts), fine print, voucher instructions.
3. **Review & Edit** — the multi-tab deal builder we already have, but pre-filled with AI output. She can edit anything, add photos, adjust pricing.
4. **Publish**

That's it. Steps 1-4 every time she creates a deal. Profile info is never re-asked.

---

## New Backend Endpoint: Story Extractor

```
POST /api/pipeline/extract-story
{
  "story": "I'm Sofia, I run a waxing and lash studio..."
}

Returns: structured business profile + services + insights
```

Uses Claude Sonnet (needs understanding, not just classification). Single call, comprehensive extraction.

System prompt: "You are a business intake specialist for Groupon. Extract structured business information from a merchant's free-form description. Return valid JSON with fields for: business_name, business_description, location, category, services (with prices), scheduling_insight, experience_years, business_type, and a list of extracted_fields. For any field you couldn't extract, set it to null. For services, extract every service mentioned with its price."

---

## What Changes in the Codebase

### Remove / Replace
- The old 6-step intake form (`IntakeForm.tsx`) → replaced by conversational interface
- The old onboarding steps → replaced by story-based onboarding
- Business info fields in deal creation → pulled from saved profile

### New Components
- `ConversationalIntake.tsx` — chat/voice interface for telling your story
- `ProfileReview.tsx` — review extracted profile, edit, save
- `ServiceSelector.tsx` — pick services from saved profile for a new deal
- `StoryExtractor` backend endpoint

### Modified
- `CreateDeal.tsx` — reads from profile, skips business info, only asks deal-specific questions
- Portal "Admin" sidebar link → merchant settings (not pipeline admin)
- Profile API → stores extracted services as part of profile

---

## What This Demonstrates in the Case Study

1. **True AI assistance** — not forms with buttons, but natural language → structured data
2. **Dramatic UX improvement** — Groupon: 21 screens of manual input. Us: tell your story once, review, done.
3. **Persistent profile** — information captured once, reused forever
4. **Measurable impact** — time to first deal: 45 min → under 5 min. That's the metric.
5. **Voice-first design** — "Tell me about your business" is more natural than "Fill out this form"

---

## Build Order

1. **Story extractor endpoint** (backend) — new LLM call that parses free-form text into structured profile
2. **Conversational intake** (frontend) — chat interface with voice, sends story to extractor
3. **Profile review** (frontend) — show extracted data, let merchant edit, save
4. **Rewire deal creation** — reads from profile, skips business setup, only asks deal-specific questions
5. **Fix sidebar Admin link** — merchant settings, not pipeline admin
6. **Test end-to-end**
