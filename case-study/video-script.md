# Video Walkthrough Script

*Target: under 10 minutes. Follow the case study's prescribed order.*

---

## 1. What I Built and Why (~2.5 min)

### Open with the problem
"Sofia owns a waxing and lash studio. She has 20 minutes between clients. She's not a marketer. Groupon's current campaign builder asks her to fill out 21 screens of forms — booking platform, categories, pricing, copy, photos, fine print, voucher instructions, business info, payment. She drops off."

### Show the findings
"I signed up as a Groupon merchant and documented the actual experience. The onboarding email link is broken — it returns a 404. The campaign builder has backend errors. Sofia would never make it through this."

*Show: 2-3 screenshots from the investigation*

### Show the solution
"Instead of fixing the form, I replaced it with AI. Sofia tells us about her business in her own words — typing or using voice dictation. The AI extracts her business name, category, services with prices, location, and generates highlights automatically."

*Demo: Go through the conversational onboarding live*
1. Type or speak a business description
2. Show the AI extracting and asking follow-ups
3. Show the profile review with all fields pre-filled
4. Show it flowing directly into deal creation

"Once her profile is saved, creating a deal is a conversation too. She says 'I want to offer my massages at 35% off for 3 months, targeting Tuesdays.' The AI sets up everything — pricing, highlights, descriptions, fine print, voucher instructions. She reviews in a 7-step builder and publishes."

*Demo: Show the deal chat → builder flow*

---

## 2. How I'd Measure Success (~2 min)

"Before I show the details, let me define how I'd know this works."

### Primary metric
"Deal creation completion rate. The percentage of merchants who start the flow and successfully publish a live deal. My assumed baseline is around 30% — most merchants stall at deal creation based on the problem description. My target is 60% or higher."

### Supporting metrics
"Time to first live deal: from 45-60 minutes down to under 10. Deal quality score: 70% of AI-generated fields accepted without editing. First deal performance: matching or beating the category average on GP30."

### Counter-metric
"The thing I'd watch most carefully: if merchants accept everything the AI generates but the deals don't convert — if acceptance is high but performance is low — that means the AI is writing deals that sound good to Sofia but don't work for customers. That's the most dangerous failure mode."

### What I don't measure
"I don't measure form completion rate — that's vanity. I don't measure time on platform — more time means more friction. I measure whether Sofia gets customers."

---

## 3. What I'd Change or Kill After Production (~2 min)

### Kill
"If the category classifier is wrong more than 20% of the time, I'd kill auto-classification and switch to a hybrid: AI suggests top 3, merchant picks."

### Change
"Discount recommendations are currently based on synthetic benchmark data. In production, I'd connect to Groupon's actual deal performance database so recommendations reflect what's really working."

"The 'Inspire Me' descriptions are repetitive for similar services. I'd pass all existing descriptions as context so each one starts differently."

### Watch
"High acceptance plus low conversion. That's the scenario where we're optimizing for the wrong thing — making deals easy to create but not effective."

### The admin panel
"This is how a PM maintains the system."

*Demo: Show the admin panel*
- 7 configurable endpoints
- Change model from Haiku to Sonnet with a dropdown
- Edit a prompt
- Run a test
- Show analytics

"Every prompt, every model selection, every temperature is configurable. No code changes needed. This is how you iterate in production."

---

## 4. What I Didn't Build and Why (~1 min)

"Scope discipline. These are V2."

- "No real booking platform OAuth — showed the credential dialogs to demonstrate capability."
- "No AI photo generation — photos need to be real. We provide upload and guidance."
- "No post-publish optimization — we optimize at creation time."
- "No real payment processing — showed the UI with mock data."
- "No real-time analytics — would need Groupon's performance data pipeline."

"The first thing that matters is: can Sofia get a deal live? Everything else is V2."

---

## 5. Show the Iteration Process (~1.5 min)

"Let me show you how this evolved."

### The shift
"We started with a 5-step form wizard. Better than 21 screens, but still fundamentally forms. After studying Groupon's actual merchant flow — 27 screenshots — I realized we weren't going far enough."

"The breakthrough was: stop building forms with AI buttons. Build AI with optional forms for review."

### Prompt iteration
"The story extractor prompt went through three versions."
*Show admin panel with the prompt*

"V1 just said 'extract business info.' Too vague — missed services. V2 added a schema. Better, but follow-up questions were generic. V3 — the current version — adds rules for inference, confidence scoring, and conversational follow-ups. It knows when to ask and when to infer."

### What broke
"Highlights came back as raw JSON — we had to add a parser for markdown code fences. Descriptions for similar services all started the same way — we had to adjust temperature and add uniqueness rules. The first-time flow auto-published deals without merchant review — we added Save as Draft."

---

## Closing

"The thesis is simple: Sofia shouldn't navigate Groupon. The AI should do the work. She tells her story once, reviews what the AI creates, and publishes. Under 10 minutes, no marketing expertise needed."
