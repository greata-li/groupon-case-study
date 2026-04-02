# Video Walkthrough Script

*Target: under 10 minutes. Hero opening, then live demo with decision callouts.*
*Supplementary detail: see demo-reference.md for page-by-page notes and decisions to mention.*

---

## Opening: The Target (~1 min)

"I'm going to show you a working AI-powered merchant platform that replaces Groupon's 21-screen deal creation flow. The metric I'm optimizing for is deal creation completion rate - from an assumed baseline of ~30% to a target of 60%+, with time to first live deal under 10 minutes."

"The counter-metric I'd watch: if acceptance is high but deal performance is low, that means the AI is writing deals that sound good to merchants but don't convert for customers. That's the most dangerous failure mode."

"Before I show the solution, let me show the problem."

*Show: 2-3 Groupon merchant flow screenshots*

"I signed up as a Groupon merchant and documented the actual experience. The onboarding email link returns a 404. The campaign builder has backend errors. 21 screens of forms for someone who has 20 minutes between clients and isn't a marketer."

---

## Live Demo (~5 min)

### Onboarding Flow
"Instead of fixing the form, I replaced it with a conversation."

*Demo: Full onboarding flow*
1. Landing page - click Get Started
2. Chat interface - type or voice-dictate a business description
3. AI extracts profile - show the "Analyzing..." state
4. Follow-up questions - "The AI notices I didn't give a full street address or phone number. These are required for voucher redemption, so it asks."
5. Profile review - editable fields, live customer preview
6. Photo upload - "Photos persist on the server and carry through to deals"
7. Save & Continue - flows directly into deal creation

**Decision callout:** "I chose conversation over forms because small business owners don't think in form fields. They think in stories. The AI handles the translation to structured data."

### Deal Creation
*Demo: Deal chat + builder*
1. Service selection from profile data
2. Multi-field parsing - "I can say '30% off for 90 days, new customers only' and the AI captures discount, duration, and terms in one message"
3. AI generates complete deal
4. 7-step builder with pre-filled content
5. "Inspire Me" button - "AI generates copy; existing descriptions are passed as context so it doesn't repeat itself"
6. Photos from profile auto-loaded
7. Save as Draft or Publish

**Decision callout:** "We separated business profile from deal creation. Sofia tells us who she is once. After that, creating deals is fast because the AI already knows her services and pricing."

### Merchant Portal (Quick Tour)
"After publishing, Sofia has a complete portal."

*Demo: Walk through key pages*
- Campaigns - status toggle, edit, delete
- Booking - connect dialog with API key entry
- Connections - credential management for multiple platforms
- Home - onboarding checklist with progress tracking
- Payments, Reviews, Reports - realistic mock data

**Decision callout:** "I built the full portal, not just the deal creator, to show where AI fits in the broader merchant experience. Pages that Groupon already has are mocked with realistic data. Pages where AI adds value are fully functional."

### Admin Panel
*Demo: Show the PM's workbench*
- 7 configurable endpoints
- Edit a prompt, change temperature
- Run a test, see output + latency
- Analytics dashboard

"Every prompt, model, and parameter is configurable without code changes. A PM can iterate on the AI pipeline by testing prompts and monitoring field acceptance rates."

---

## What I'd Change or Kill (~1.5 min)

### Kill
"If category classification is wrong more than 20% of the time, kill auto-classification. Switch to AI suggests top 3, merchant picks."

### Change
"Connect to Groupon's actual deal performance database instead of synthetic benchmarks. Real data makes the discount recommendations trustworthy."

### Watch
"High acceptance plus low conversion. That's optimizing for the wrong thing."

---

## What I Didn't Build (~1 min)

"Scope discipline - these are V2."

- No real booking API integration - showed the credential dialogs to demonstrate the UX
- No AI photo generation - photos need to be real
- No post-publish optimization - optimize at creation time
- No real payment processing - UI with realistic mock data

"The first question is: can Sofia get a deal live? Everything else is V2."

---

## Iteration (~1 min)

"The prompt engineering went through three versions. V1 was too vague. V2 had a schema but generic follow-ups. V3 adds inference rules, confidence scoring, and conversational follow-ups that feel natural."

"During QA, we found and fixed: discount calculations not propagating, edit flow creating duplicates, descriptions repeating the same opening phrases, and the deal chat not parsing multi-field responses. Every bug was a chance to make the system more robust."

"The full iteration log and all 16 technical decisions are documented in the handoff materials."

---

## Closing

"Sofia shouldn't navigate Groupon. The AI should do the work. She tells her story once, reviews what the AI creates, and publishes. Under 5 minutes, no marketing expertise needed."

"For details on every technical decision, the iteration process, and what I'd prioritize for production - it's all in the documentation I'm handing off alongside this video."
