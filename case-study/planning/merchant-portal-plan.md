# Merchant Portal Plan - Dashboard & Management

*Based on 12 screenshots of Groupon's actual merchant.groupon.com portal.*

---

## What Groupon's Merchant Portal Has

### Sidebar Navigation (12 items)
1. **Home** - Onboarding checklist, progress tracker, campaign summary, support links
2. **Campaigns** → Active / Drafts - List of deals with status, launch date, actions
3. **Booking** - Calendar management, availability, fill empty slots, notify customers
4. **Voucher List** - Filter by status (sold/redeemed), campaign, date range
5. **Bulk Redeem** - Manual voucher code entry or CSV upload for batch processing
6. **Customer Reviews** - Average rating, total/positive/negative breakdown, filter
7. **Payments** - Payout schedule, transaction history, estimated payout date
8. **Exported Reports** - Vouchers and Payments tabs, export history
9. **Support** - Knowledge base with search, categorized articles, sales rep contact
10. **Admin** - Account management
11. **Connections** - Booking platform integrations (Booker, Mindbody, Square)
12. **Business name + Sign Out** - Account footer

### Home Page Details
- Welcome banner with business name
- **Onboarding checklist** (collapsible sections):
  - Connect a booking platform (Connect / Skip for now)
  - Secure your account
  - Prepare to welcome customers
  - Learn voucher redemption
  - Payments and refunds
  - Understand campaign performance
- **Your campaign** card - shows first campaign status or "create" prompt
- **Your Progress** tracker - linear steps:
  - Signed contract ✓
  - Booking platform connection
  - Campaign in preparation
  - Campaign is live
  - First Sale
  - First Redemption
  - First Payment
- Support section + Contact Sales Representative button

### Campaigns Page
- Tabs: Active / Drafts
- Table: Campaign name (linked), Status badge, Action menu (...)
- "+ New Campaign" green button top-right
- Draft shows: title, launch date

### Key Observations
1. **Onboarding checklist on Home** - guided setup, expandable sections, progress tracking
2. **Progress tracker** - visual linear stepper showing merchant journey
3. **Deal drop-off tracking** - the login redirect URL contains `DealDropOff_Send1` - they actively email merchants who abandon the flow
4. **Booking page** - marketing page to promote booking integration, not just a settings panel
5. **Support is prominent** - knowledge base with search, article categories, sales rep contact
6. **Everything empty until first campaign** - portal redirects to campaign builder until setup is complete

---

## What We Build

We don't replicate Groupon's portal 1:1. We build an AI-enhanced version that covers the same ground but demonstrates what's possible with AI assistance at every step.

### Merchant Portal Sidebar

| Nav Item | Status | What It Shows | AI Enhancement |
|----------|--------|---------------|----------------|
| **Home** | Full | Onboarding checklist, progress tracker, campaign card, quick stats | AI-generated "next steps" recommendations |
| **Campaigns** | Full | Active/Draft/All tabs, campaign table with status, actions | - |
| **Create Deal** | Full | The AI-assisted deal creation flow (Flow B) | Full pipeline: classify, suggest, generate |
| **Booking** | Info page | What booking integration offers, connect CTA | - |
| **Voucher List** | Functional | Table with filters (status, campaign, date) | - |
| **Customer Reviews** | Display | Rating summary, review list (mock data) | AI-generated response suggestions |
| **Payments** | Display | Payout schedule, transaction table (mock) | - |
| **Reports** | Display | Export options, report history (mock) | - |
| **Support** | Info page | Knowledge base categories, contact info | AI chatbot for merchant support |
| **Admin** | Display | Account settings, business profile edit | - |
| **Connections** | Functional | Booking platform cards (Booker, Mindbody, Square) | - |

### "Full" = fully interactive with real data flow
### "Functional" = works with mock/local data
### "Display" = shows the UI but data is simulated
### "Info page" = static content explaining the feature

---

## What This Demonstrates in the Case Study

1. **Completeness** - Every page in Groupon's portal has a counterpart. Nothing is missing.
2. **AI integration depth** - AI isn't just in deal creation. It helps with reviews, support, onboarding guidance.
3. **Platform thinking** - This isn't a one-trick deal generator. It's a merchant platform that happens to be AI-first.
4. **Product investigation** - "We studied the actual merchant portal, identified every feature, and built an AI-enhanced equivalent."
5. **Vibe coding capability** - "We built a complete merchant platform by studying the existing product and enhancing it with AI, all through AI-assisted development."

---

## Build Priority for the Portal

### Must Have (for the video demo)
1. Home with onboarding checklist + progress tracker
2. Campaigns list (Active/Drafts) with status and actions
3. Create Deal (the full AI-assisted flow)
4. Business Profile (view/edit)
5. Customer Preview (how customers see the deal)

### Should Have (shows completeness)
6. Voucher List with mock data
7. Customer Reviews with mock data + AI response suggestion
8. Connections page
9. Booking info page

### Nice to Have (shows ambition)
10. Payments with mock data
11. Reports page
12. Support with AI chatbot
13. Admin/settings

---

## Admin Panel Expansion

The current admin panel manages LLM endpoints. With a fuller platform, the admin panel should also show:

### Existing (keep)
- Pipeline endpoints (prompt editor, test panel)
- Benchmark data editor

### Add
- **Deal Analytics** - how many deals generated, acceptance rate per field, average confidence scores
- **Pipeline Performance** - latency trends, error rates, token usage per endpoint
- **Prompt Version History** - track what changed in prompts over time, compare outputs
- **A/B Test Runner** - run same input through two prompt versions, compare side by side
- **Merchant Activity** - who's creating deals, where they drop off, what they edit most

This positions the admin panel as a real PM tool, not just a config editor.
