# Scope Expansion Plan — What We Learned from the Real Flow

*Based on 27 screenshots of the actual Groupon Merchant Center campaign builder, March 2026.*

---

## What Groupon's Current Flow Actually Looks Like

| Step | Sub-screens | What Sofia must do | Decisions required |
|------|-------------|--------------------|--------------------|
| 1. Initial Setup | 7 | Choose booking platform, select category (3 levels deep), pick a template | 4 major decisions |
| 2. Deal Creation | 7+ | Edit each option (name, price, discount, cap), upload photos, write highlights, write description, configure fine print, set voucher instructions | 15+ fields across 7 pages |
| 3. Business Info | 4 | Write business description, provide website, select business type, enter bank details | 8+ fields |
| 4. Tax Compliance | 1 | Complete DAC 7 form | 1 (broken) |
| 5. Review | 1 | Review all info | Read-only |
| 6. Submit | 1 | Submit campaign | 1 click |
| **Total** | **~21 screens** | | **30+ decisions** |

**Key insight:** Our current prototype covers the *content generation* part well (what the AI generates in Step 2 of Groupon's flow) but doesn't address the full journey from signup to published deal. Here's what we should expand.

---

## What Our Prototype Currently Covers

| Groupon Step | Our Coverage | Status |
|-------------|-------------|--------|
| Category selection | AI auto-classifies from business description | Done |
| Template selection | Skipped — AI generates from scratch, which is better | Done |
| Option naming + pricing | AI generates with market-informed pricing | Done |
| Deal description | AI generates | Done |
| Fine print | AI generates from templates | Done |
| Photo upload | Guidance only ("deals with photos convert 2x") | Done (guidance) |
| Highlights | Not covered | Gap |
| Voucher instructions | Not covered | Gap |
| Business description | Captured in intake but not used in deal preview | Gap |
| Scheduling/redemption | Recommendation only, not structured | Partial |

---

## Recommended Expansions (Priority Order)

### Priority 1: Expand the Deal Preview to Match Groupon's Actual Deal Page

**Why:** Our deal preview is good but missing fields that the real Groupon flow requires. If an interviewer compares our output to the real merchant flow, the gaps will be visible.

**What to add:**
- **Highlights section** — AI-generated bullet points about the business (the real flow has a 450-char rich text field with "Inspire Me" button)
- **Voucher instructions** — Where to redeem, appointment needed?, phone number (the real flow requires this)
- **Business description** — We already capture this in intake Step 2 but don't show it in the preview. The real flow has a separate 400-char field.

**Effort:** Medium. These are additional fields in the deal generator's JSON output + new sections in the preview UI.

### Priority 2: Show What We Skip (and Why)

**Why:** The case study explicitly asks "what you didn't build and why." Now we have the real flow to compare against, we can be very specific.

**What to document:**
- We skip template selection → AI generates from scratch (better because templates are generic)
- We skip 3-level category drill-down → AI auto-classifies (faster, less error-prone)
- We skip photo upload → We provide guidance (photos require the merchant, not AI)
- We skip bank details / tax compliance → These gate deal creation but should happen in parallel
- We skip the "you can't change this" lock → Draft should always be editable

**Effort:** Low. This is documentation, not code.

### Priority 3: Improve Fine Print Generation

**Why:** The real Groupon fine print page is extensive — voucher limits, expiry periods, cancellation policy, redemption rules, "not valid with other offers" checkboxes. Our AI generates free-text fine print, but the real flow has structured options.

**What to add:**
- Generate fine print as structured fields (max vouchers per person, expiry days, cancellation policy) rather than free text
- Show these as editable chips/toggles in the preview, not a text block
- This maps to what Groupon actually requires for submission

**Effort:** Medium. Requires updating the deal generator prompt to output structured fine print, plus UI changes in the preview.

### Priority 4: Add "Inspire Me" / AI Assist for Individual Fields

**Why:** Groupon already has an "Inspire Me" button on the highlights field, but it's not AI-powered — it just shows an example. We can do better: when Sofia is reviewing her deal, she could click "Suggest" on any field to get an alternative.

**What to add:**
- Small "Suggest" button next to each editable field in the deal preview
- Clicking it calls the deal generator with just that field + context, returns an alternative
- This is the Deal Optimizer (Endpoint 4) from the original PRD — we scoped it as optional but now have a clear use case

**Effort:** Medium-High. New endpoint + UI interaction + API call per field.

### Priority 5: Template Comparison View (for the video)

**Why:** The real flow shows template options with stock photos (screenshot 11). We could show a "what Groupon would have given you vs what AI generated" comparison in the admin panel — powerful demo for the video.

**What to add:**
- Hardcode one of the real templates (from the screenshot) as a "before"
- Show the AI-generated deal as the "after"
- Side-by-side comparison in the admin or as a demo page

**Effort:** Low. Static content + layout.

---

## What NOT to Expand

| Feature | Why we skip it |
|---------|---------------|
| Booking platform integration | We don't have access to Mindbody/Booker/Square APIs. Mention as V2. |
| Photo upload | Requires the merchant's actual photos. AI can't take a picture of Sofia's studio. |
| Bank details / payment info | Not part of deal creation. Should be a separate onboarding flow. |
| Tax compliance (DAC 7) | Regulatory requirement that should happen post-deal-creation, not block it. |
| Draft deletion | Their system doesn't allow it either. We don't persist deals, so it's N/A. |

---

## Observations for the Case Study Report

### Things Groupon Does Well
1. **Template system** — Provides pre-built deal packages with stock photos. Reduces blank-page anxiety. Smart starting point.
2. **Live preview sidebar** — As you edit options, a real-time preview shows how the deal will look. Good feedback loop.
3. **Tips sidebar** — Contextual tips ("Write short, clear option titles", "Don't write about restrictions") appear next to the relevant field.
4. **"Inspire Me" button** — On the highlights field, though it's just an example, not AI-generated.
5. **Recommended discount indicator** — Shows a green bar for the recommended discount range on the pricing page.

### Things Groupon Does Poorly
1. **Irreversible draft actions** — "Once you've submitted it, you won't be able to change it" on a DRAFT. This is the opposite of what drafts are for.
2. **No draft deletion** — Can't delete a campaign you started. You're stuck with it.
3. **3-level category selection** — Main category → subcategory → service-level. Sofia has to navigate a taxonomy she doesn't know. Our AI does this in one step.
4. **Sequential gating** — Steps 5-6 locked behind Step 4. If Step 4 breaks (which it does), everything stops.
5. **No error messages** — Step 4 fails silently. 502 errors hidden from the user.
6. **Broken onboarding email** — The very first link a new merchant clicks leads to a 404.
7. **Form length** — 21 screens, 30+ decisions. Sofia has 20 minutes between clients.
8. **Photo requirements** — "All photos must be in landscape (horizontal) orientation" — adds friction for someone taking photos on their phone.

### The "Cannot Go Back" Problem

Screenshot 12 shows: *"Carefully review the information above. Once you've submitted it, you won't be able to change it."*

This appears after selecting a template, BEFORE the deal creation steps. The merchant hasn't even started writing their deal yet, and they're being told their initial setup choices are permanent. Theories on why:

1. **Technical debt** — The system was built assuming a linear flow and the backend doesn't support re-selecting a template after options are generated.
2. **Integration constraints** — If connected to a booking platform (Mindbody/Square), changing the category could break the integration mapping.
3. **Pricing structure** — Groupon's internal pricing/commission may vary by category, so changing it post-selection creates billing complexity.

Regardless of the reason, the UX is hostile. A draft that can't be edited is not a draft. Our prototype has no irreversible states — everything is editable until you hit publish.

---

## Next Steps

1. **Implement Priority 1** (expand deal preview with highlights, voucher instructions, business description)
2. **Write the comparison doc** (Priority 2 — what we skip and why, with screenshots as evidence)
3. **Decide on Priority 3-5** based on time available before the video

Ready to review?
