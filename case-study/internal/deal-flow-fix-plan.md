# Deal Flow Fix Plan

## Current Problems

1. **Auto-publish as Active** - deals created via chat go straight to Active with no review
2. **One-question chat** - AI extracts after one message, no follow-ups
3. **Raw JSON in highlights** - enhance-text returns JSON array, displayed as raw text
4. **Edit goes to chat** - clicking Edit on a campaign opens the chat instead of the builder
5. **Chat skips builder** - chat -> auto-publish, never shows the 7-step review
6. **No approval screen** - Sofia never sees the complete deal before it goes live

## Fixed Flow

### A. First-time onboarding + first deal
1. Business chat → AI extracts profile → profile review → save
2. Deal chat → AI asks follow-up questions:
   - "Which services?" (if not clear)
   - "What discount are you thinking?" (if not specified)
   - "How long should this deal run?" (30/60/90 days)
   - "Any days or times you want to target?" (scheduling)
   - "Any special terms?" (new customers only, etc.)
3. AI says: "Great, I've set everything up. Let me show you the details so you can review."
4. **Transitions to step-by-step builder** with all 7 steps pre-filled
5. Sofia reviews each step, makes adjustments
6. Step 7 (Review): complete summary + customer preview
7. "Save as Draft" or "Publish" - both save first, "Publish" sets status to Active

### B. Returning merchant - Create Deal
1. Portal → Create Deal → deal chat (services pre-loaded)
2. Same conversational flow with follow-ups
3. → Builder (pre-filled) → Review → Save/Publish

### C. Edit existing deal
1. Portal → Campaigns → Edit → **Builder loaded with deal data** (NO chat)
2. All 7 steps populated from saved deal
3. Review → Save changes

## Technical Changes

### 1. DealChat: Add follow-up questions
Instead of extracting after one message, the chat should:
- Parse Sofia's first message for what's present and what's missing
- Ask targeted follow-ups for missing info
- Only call extract-deal after enough info is gathered
- Backend can handle this: extract-deal already returns missing_fields concept

### 2. Onboarding: Don't auto-publish
Change `handleDealExtracted` in ConversationalOnboarding to:
- NOT call publishDeal()
- Instead, store the extracted deal data
- Navigate to `/portal/create?prefill=true` with deal data
- Or: transition to the builder phase within the onboarding page

### 3. Highlights JSON fix
In the enhance-text response handler:
- Check if the response looks like a JSON array
- If so, parse it and join with newlines
- Strip any markdown code fences

### 4. Edit route
- Add `/portal/campaigns/edit/:id` route
- Loads deal from API, populates builder
- No chat phase, goes straight to builder

### 5. Publish flow
- Step 7 "Review" has two buttons: "Save as Draft" and "Publish Deal"
- "Save as Draft" saves with status: 'draft'
- "Publish Deal" saves with status: 'active'
- Both show a confirmation before saving

## Build Order
1. Fix highlights JSON parsing (quick fix)
2. Fix onboarding to NOT auto-publish, redirect to builder instead
3. Add follow-up questions to deal chat
4. Add edit route that loads deal into builder
5. Fix publish to default to Draft
