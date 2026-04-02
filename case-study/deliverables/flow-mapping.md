# Groupon Flow Mapping: Every Field, Why It Exists, How We Handle It

*Maps every piece of information the current Groupon merchant flow collects to our AI-assisted approach. Based on 27 screenshots of the live Merchant Center, March 2026.*

---

## Legend

- **AI** = Our AI generates this from the intake answers
- **Sofia** = Sofia must provide this (can't be inferred)
- **Skip** = Not needed for deal creation (separate flow)
- **Default** = We set a smart default, Sofia can override
- **New Q?** = Potentially needs a new intake question

---

## Step 1: Initial Setup

| Screen | Field | Why Groupon Needs It | Our Approach | Notes |
|--------|-------|---------------------|-------------|-------|
| 02 | Booking platform choice | Determines if deals auto-sync with Mindbody/Booker/Square | **Skip** | Integration feature, not deal content. Mention as V2. |
| 04-06 | Campaign category (3-level) | Determines where the deal surfaces in search, affects pricing benchmarks, commission rates | **AI** | Our classifier already does this from business description. Category → subcategory → service level. |
| 07-10 | Category manual selection | Fallback if auto-assign fails | **AI** (with fallback) | If confidence < 80%, show top 3 and let Sofia pick. Already in our classifier design. |
| 11 | Template selection | Pre-fills deal options, provides starting structure, stock photos | **AI** | Our generator creates from scratch - better than a template because it's tailored to Sofia's specific business, not generic. |
| 12 | "Submit and continue" warning | Locks initial setup choices | **Skip** | We have no irreversible states. Everything is editable. |

**Assessment: No new questions needed.** Our intake already captures what this step needs (business description → category, services → deal structure).

---

## Step 2: Deal Creation

### Options (screens 13-15)

| Field | Why Groupon Needs It | Our Approach | Notes |
|-------|---------------------|-------------|-------|
| Option name | Customer-facing service name | **AI** | Generated from intake services. Sofia edits in preview. |
| Regular price | Strikethrough price, discount calculation | **Sofia** (intake step 4) | Already captured in our service picker. |
| Groupon price | What customer pays | **AI** | Market intelligence recommends optimal discount. |
| Discount % | Shown on deal page, affects visibility | **AI** | Calculated from regular vs Groupon price. |
| Monthly voucher cap | Limits how many deals sell per month | **Default** → Sofia override | Currently NOT in our flow. Groupon recommends higher cap = more promotion. We should default to 50 and let Sofia adjust. |
| Number of options | Multiple service tiers | **AI** | Already generates multiple options + bundle. |

**Gap found: Monthly voucher cap.** This is a business decision - how many new customers can Sofia handle? We should add this to the preview as an editable default, not a new intake question. Default: 50 per option (Groupon's recommendation).

### Photos (screens 16-18)

| Field | Why Groupon Needs It | Our Approach | Notes |
|-------|---------------------|-------------|-------|
| Photo upload | Deal pages with photos convert 2x better | **Guidance** | We can't take photos for Sofia. We provide guidance + suggest stock photo category. |
| Photo source (own/website/stock) | Determines review requirements | **Default: stock** | In production, default to stock photo for the category, let Sofia upgrade later. |
| Photography guidelines | Ensure quality | **Skip** | Not relevant to AI flow. |

**Assessment:** Our current photo guidance is appropriate. In a real implementation, we'd auto-select a relevant stock photo from Groupon's library based on category. Worth mentioning in the video.

### Highlights (screen 19)

| Field | Why Groupon Needs It | Our Approach | Notes |
|-------|---------------------|-------------|-------|
| Highlights text (450 char) | Short bullet points shown prominently on deal page. "All-day access to dry and wet Russian and Turkish saunas, hot tubs, and cold plunge pools" | **AI** | NOT currently generated. Should be. These are the "at a glance" selling points. |
| "Inspire Me" button | Helps merchant write highlights | **AI** | Our entire flow IS "Inspire Me." |

**Gap found: Highlights.** This is a distinct field from the description - shorter, punchier, shown more prominently. Our deal generator should output this.

### Description (screen 20)

| Field | Why Groupon Needs It | Our Approach | Notes |
|-------|---------------------|-------------|-------|
| What's included per option | Detailed breakdown of each service option | **AI** | Currently we generate one description. Should generate per-option details. |
| Guidelines sidebar | Tells merchant what to write | **Skip** | AI handles the "what to write" problem entirely. |

**Gap found: Per-option descriptions.** Currently our deal has one description. The real Groupon deal has a description per option. Our generator should output these.

### Fine Print (screen 21)

| Field | Why Groupon Needs It | Our Approach | Notes |
|-------|---------------------|-------------|-------|
| Max vouchers per purchase | Limits abuse | **Default: 1** | Standard. |
| Expiry period | Legal requirement, creates urgency | **Default: 90 days** (Groupon recommends "Every 30 days") | AI should pick based on service type. |
| Voucher expiry value | What happens when voucher expires - customer can still use toward full price | **Default** | Standard clause, AI generates. |
| Amount paid never expires | Legal requirement | **Default: Yes** | Always true. |
| Cancellation/refund policy | Required for service businesses | **AI** | Generate based on service type. "Consultation required; cancellation and other refund requests will be honored before service provided." |
| Optional restrictions | "Not valid with other offers", "One per booking/visit", "Must sign waiver", "Not valid toward gratuity" | **AI selects relevant ones** | Currently free text. Should be structured checkboxes that AI pre-selects based on service type. |

**Gap found: Structured fine print.** Currently we generate free text. Should output structured fields (expiry, voucher limit, restrictions as boolean flags) that map to what Groupon actually needs for submission.

### Voucher Instructions (screen 22)

| Field | Why Groupon Needs It | Our Approach | Notes |
|-------|---------------------|-------------|-------|
| Redemption method | Physical location / travel to customer / online | **Default: Physical location** | For beauty/spa, always physical. AI can infer from service type. |
| Business address | Where customers go | **Sofia** (intake step 3) | Already captured as "location." But we don't have the full street address - just city/neighborhood. |
| Appointment required? | Affects how customers book | **Default: Yes** | For appointment-based businesses (beauty, spa), always yes. AI infers. |
| Phone number | Shown on voucher for booking | **Sofia** | NOT currently captured. |

**Gap found: Phone number.** Sofia needs to provide a contact number for voucher redemption. We also only capture city/neighborhood, not a full address.

**Resolution (implemented):** Phone number and full street address are now REQUIRED fields. The AI prompt generates targeted follow-up questions during onboarding if they are missing. This ensures voucher redemption info is always captured before deal creation, without adding manual form steps.

---

## Step 3: Business Info

| Screen | Field | Why Groupon Needs It | Our Approach | Notes |
|--------|-------|---------------------|-------------|-------|
| 23 | Business description (400 char) | Merchant profile, shown on deal page | **AI** | Generated from intake. Already captured. |
| 24 | Business website | Verification, SEO, customer trust | **Sofia** | NOT currently captured. |
| 25 | Business type (sole provider, contractor, company, third party) | Legal/tax classification, affects contracts | **Default** | Can infer from description. "Two-chair studio" = sole provider. |
| 26 | Payment info (bank details) | Payout processing | **Skip** | Not deal creation. Should be a separate onboarding step that doesn't block deal publishing. |

**Gap found: Business website.** Groupon requires this and it helps with verification. But it shouldn't block deal creation.

---

## Step 4-6: Tax, Review, Submit

| Step | Why It Exists | Our Approach |
|------|-------------|-------------|
| Tax compliance (DAC 7) | EU regulatory requirement | **Skip** - Not deal content. Should be parallel onboarding. |
| Review | Final check before submission | **Our preview IS the review.** Sofia sees everything before publishing. |
| Submit | Sends to Groupon for approval | **Our "Publish" button.** |

---

## Summary: What Changes

### Gaps Found - Need to Add to Our AI Output

| Gap | Where It Appears | Impact | Add to Intake? |
|-----|-----------------|--------|---------------|
| Highlights | Prominent on deal page | High - missing a key selling section | No - AI generates from existing intake |
| Per-option descriptions | Under each service option | Medium - adds detail | No - AI generates |
| Monthly voucher cap | Controls deal volume | Medium - business decision | No - default in preview, Sofia adjusts |
| Structured fine print | Legal/compliance fields | High - Groupon requires structured data | No - AI pre-selects relevant restrictions |
| Voucher redemption method | How customers use the deal | Low - defaults work for 90% of cases | No - default: physical, appointment required |
| Phone number | On voucher for booking | High - needed for real deal | **Required** - AI follow-up if missing |
| Business website | Merchant verification | Low for prototype | Optional in preview |
| Full street address | On voucher / map | High - needed for real deal | **Required** - AI follow-up if missing |

### Do We Need New Intake Questions?

**No.** Every gap can be handled by:
1. Expanding the AI generator output (highlights, per-option descriptions, structured fine print)
2. Adding smart defaults in the preview (voucher cap, redemption method, expiry)
3. AI-driven follow-up questions during the conversational intake for required fields (phone, full address)
4. Adding optional fields in the preview that Sofia fills before publishing (website)

The intake stays conversational. The AI does more work - including asking for phone and full address if Sofia doesn't mention them. The preview gets richer with more editable sections. Sofia's effort doesn't increase.

### Phone Number / Full Address (Resolved)

These are required for voucher redemption. **Implemented: the AI prompt treats phone and full_address as required fields and generates follow-up questions if they are missing from the merchant's initial description.** This keeps the conversational flow natural while ensuring critical contact info is always captured before deal creation.

---

## How This Maps to Our Prototype Changes

### Deal Generator Prompt - Expand Output
```json
{
  "title": "...",
  "description": "...",
  "highlights": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "services": [
    {
      "name": "...",
      "description": "What's included in this option",
      "original_price": 65,
      "discount_pct": 40,
      "deal_price": 39,
      "voucher_cap": 50
    }
  ],
  "fine_print": {
    "expiry_days": 90,
    "max_per_person": 1,
    "appointment_required": true,
    "new_customers_only": true,
    "restrictions": ["Not valid with other offers", "Gratuity not included"],
    "cancellation_policy": "..."
  },
  "voucher_instructions": {
    "redemption_method": "physical_location",
    "appointment_required": true
  },
  "category": "...",
  "scheduling_recommendation": "...",
  "photo_guidance": "...",
  "confidence": { ... }
}
```

### Deal Preview - Add Sections
1. Highlights (editable bullet list)
2. Per-option "What's included" (editable per service)
3. Structured fine print (toggles/chips instead of free text)
4. Voucher instructions (defaulted, editable)
5. "Contact details" section (phone, address - optional, flagged as needed)

### No Changes
- Intake form (stays at 5 questions)
- Pipeline architecture (same 3 endpoints, expanded output)
- Admin panel
