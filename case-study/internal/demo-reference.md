# Page-by-Page Demo Reference

*Speaker notes for each page. Reference during practice runs. Not a deliverable.*

---

## Landing Page (/)
**What to show:** Hero section, "Under 5 min" stat, 3-step visual, Get Started CTA
**Decision to mention:** Smart routing - new merchants go to onboarding, returning merchants go straight to deal creation (checks profile.onboarded flag)

## Onboarding Chat (/onboarding)
**What to show:** Type a business description, voice dictation button, AI processing state
**Decision to mention:** Conversational AI instead of forms (Decision 014). "Small business owners think in stories, not form fields."
**Detail:** Session persists across page refresh. AI asks follow-up questions for missing address/phone (required for voucher redemption).

## Profile Review (/onboarding - review phase)
**What to show:** All fields pre-filled and editable, category with confidence %, services with prices, customer preview sidebar, photo upload
**Decision to mention:** AI extracts structured data from natural language. Merchant reviews and corrects before saving. "Human-in-the-loop - AI does the work, merchant has final say."

## Deal Chat (/portal/create - chat phase)
**What to show:** Services listed as bullet points, multi-field parsing ("30% off for 90 days, new customers only" captures 3 fields at once)
**Decision to mention:** Profile/deal separation (Decision 015). "Business profile is set once. Deal creation pulls from it - no re-entering services or prices."
**Detail:** Chat detects percentages, day names, duration, and restriction keywords. Reduces questions from 5 to 2-3 when merchant provides rich answers.

## Deal Builder (/portal/create - steps 1-7)
**What to show:** 7 steps with AI pre-fill, discount auto-calculated, "Inspire Me" button, voice dictation, live customer preview
**Step 1 - Services:** Groupon prices pre-filled, discount % auto-calculated, monthly cap
**Step 2 - Photos:** Profile photos auto-loaded, click to set primary, add more via upload
**Step 3 - Highlights:** AI-generated, editable. "Inspire Me" generates fresh copy.
**Step 4 - Description:** Per-service descriptions. Existing descriptions passed as context to prevent repetition.
**Step 5 - Fine Print:** Smart defaults from AI (appointment required, new customers only)
**Step 6 - Voucher:** Redemption instructions with address/phone from profile
**Step 7 - Review:** Full summary, Save as Draft or Publish
**Decision to mention:** "Inspire Me" passes all existing descriptions as context so the AI never starts two descriptions the same way (Decision implicit in prompt engineering).

## Portal Home (/portal/home)
**What to show:** Onboarding checklist with progress tracking, quick links to key actions
**Decision to mention:** "Modeled after Groupon's actual merchant portal. 12 pages total."

## Campaigns (/portal/campaigns)
**What to show:** All/Active/Drafts tabs, status dropdown (Active/Draft), edit button, delete with confirmation
**Detail:** Edit navigates to /portal/create?edit=ID - loads existing deal data into the builder.

## Booking (/portal/booking)
**What to show:** Feature cards, two buttons per platform (Connect + Get API Key), credential dialog
**Decision to mention:** "The credential dialog demonstrates the UX. We didn't build actual vendor API integration - Groupon already has that. This shows we understand the flow."

## Connections (/portal/connections)
**What to show:** 5 platforms (Booker, Mindbody, Square, Google, Yelp), connect/disconnect, credential fields with realistic placeholder keys
**Detail:** Marks booking checklist item complete when connected.

## Voucher List, Reviews, Payments, Reports, Support
**What to show:** Quick scan of each - realistic mock data, functional UI
**Decision to mention:** "These are mocked with realistic data. They exist to show I understand the full merchant journey, not just deal creation. Pages where AI adds value are fully functional. Pages Groupon already has are UI-complete with mock data."

## Admin Panel (/admin)
**What to show:** 7 endpoints, click into one, edit prompt/model/temperature, test panel, analytics
**Decision to mention:** "This is how a PM maintains an AI system. No code changes needed to iterate on prompts, swap models, or test outputs."
**Detail:** Reset Profile button for demo walkthroughs. API Docs link opens Swagger UI.

---

## Key Decisions to Reference (full details in decisions.md)

| # | Decision | One-liner for the video |
|---|----------|------------------------|
| 001 | Python/FastAPI backend | AI ecosystem, auto-generated API docs |
| 002 | Claude API (single provider) | Architecture supports swapping, prototype uses one |
| 003 | Tailwind + shadcn/ui | AI-assisted coding produces reliable output |
| 006 | JSON file persistence | No database setup - appropriate for prototype |
| 007 | Local photo storage | Production would use S3 + CDN |
| 013 | Required address/phone | AI asks follow-ups for fields needed for voucher redemption |
| 014 | Conversational AI over forms | The core thesis of the case study |
| 015 | Profile/deal separation | Tell us who you are once, create deals fast after that |
| 016 | Full portal, not just deal creator | Shows product thinking beyond a single feature |

"For the full list of 16 decisions with options considered, tradeoffs, and production migration paths - it's all in the decision log I'm handing off."
