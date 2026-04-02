# Platform Rebuild Plan - Complete Merchant Portal

*Based on screenshot-by-screenshot analysis of Groupon's actual Merchant Center.*

---

## Architecture: Two Flows + Dashboard

### Flow A: Business Onboarding (first-time setup)
Sofia sets up her merchant profile once. After this, she only uses Flow B to create deals.

### Flow B: Deal Creation (repeatable)
Create a new deal/campaign. This is the core AI-assisted experience.

### Dashboard: Merchant Home
Manage deals, view activity, access all platform features.

---

## Flow A: Business Onboarding

**Pages (in order):**

### A1. Welcome
- Campaign Builder intro
- What to expect, how long, what you need
- "Get Started" CTA

### A2. Booking Platform
- Connect Mindbody, Booker, or Square
- "Continue without a booking platform" option
- AI enhancement: "Which booking system do you use?" - auto-detect from business description

### A3. Category Selection
Three methods (matching Groupon):
- **AI-recommended**: Auto-classified from business description with confidence score
- **Search**: Type keywords, get matching categories
- **Manual browse**: Main category → Subcategory → Service-level (3-level drill-down)
Categories: Health/Beauty/Wellness, Things to Do, Home & Auto, Restaurants, Retail

### A4. Business Description
- Rich text area (400 chars)
- **"Inspire Me" button**: AI generates description from business name + category
- **"Share More Details" button**: AI expands/improves what's written
- Example shown below the editor
- AI enhancement: Voice dictation - "Tell us about your business in your own words"

### A5. Business Website
- URL input with validation
- Requirements: must match business name, public URL

### A6. Business Type
- Sole provider / Independent contractor / Company / Third party representative
- Each with example description

### A7. Business Address & Contact
- Full address (street, city, state, zip)
- Phone number
- Option to add multiple locations

### A8. Payment Info
- Bank name, institution number, transit number, account number
- "Where can I find this?" help section
- Note: For prototype, we show the form but don't process. Mark as "prototype - payment processing simulated."

### A9. Profile Review
- Summary of all business info
- Edit buttons for each section
- "Complete Setup" CTA

---

## Flow B: Deal Creation

**Left sidebar navigation (matching Groupon's pattern):**

### B1. Options (Deal Configuration)
- Add multiple service options (up to 4+)
- Each option has:
  - Option name (with AI suggestion)
  - Regular (non-discounted) price
  - Groupon price + discount % (with recommended discount from market data)
  - Monthly voucher cap (with recommendation)
- **Live preview panel on right side** showing how the deal looks to customers
- "Add a new option" button
- AI enhancement: Pre-populate options from business category + service suggester

### B2. Photos
- Three sources: Upload own, from website URL, stock photo library
- Photo upload with drag-and-drop
- Stock photo library: searchable by category, keyword filtered grid
- Photo guidelines (max 20, landscape orientation)
- AI enhancement: Suggest relevant stock photos based on category. Future: AI photo enhancement/generation.
- Tips sidebar: "Use your own photos" recommendation, example photos by business type

### B3. Highlights
- Rich text editor (450 chars)
- Bold, italic, list formatting
- **"Inspire Me" button**: AI generates highlights from business description + deal options
- **"Share More Details" button**: AI expands what's written with more selling points
- Character counter
- Example shown below
- Tips sidebar: Keep short, check for typos

### B4. Description (What's Included)
- Lists each option from B1
- Rich text editor per option describing what's included
- **"Inspire Me" button**: AI generates description for each option
- Guidelines sidebar: Essential info (required) vs Non-Essential (nice-to-have)
- Example with bullet points

### B5. Fine Print
- How many vouchers per purchase (1/2/3)
- Expiry period (30/60/90 days) with "Recommended" badge
- Expired voucher value explanation
- Refund/cancellation policy (pre-filled, editable)
- **Optional restrictions** (checkboxes):
  - All goods/services must be used by same person
  - Limit to booking, video, or telesales
  - Not valid with insurance
  - Must sign waiver
  - Not valid toward gratuity
  - Includes delivery

### B6. Voucher Instructions (How to Redeem)
- Redemption method: physical location / travel to customer / online
- Business address(es) with edit
- Add multiple locations
- Appointment required toggle
- Phone number for bookings

### B7. Review & Publish
- Complete deal summary
- Live customer preview (full Groupon deal page)
- Checklist of incomplete items
- "Publish Deal" CTA

---

## Dashboard: Merchant Home

**Sidebar navigation (matching Groupon's actual sidebar):**

### Home
- Welcome message
- Active campaigns summary
- Quick stats (views, purchases, revenue - mock data for prototype)
- "Create New Campaign" CTA
- Unfinished drafts with "Resume" button

### Campaigns (My Deals)
- List of all deals: active, draft, expired, paused
- Status badges
- Quick actions: Preview, Edit, Pause, Delete
- Performance metrics per deal (mock)

### Customer Preview
- Full Groupon-style deal page as customers see it
- Buy Now button, option selector, urgency indicators

### Business Profile
- View/edit all business info from Flow A
- Business description, website, type, address, payment

### Connections
- Booking platform status (connected/not connected)
- Available integrations

---

## AI Enhancements (beyond what Groupon has)

### 1. Conversational Intake (Chat Assistant)
- Optional: "Tell me about your business" chat/voice interface
- AI asks questions conversationally, fills in the forms
- Alternative to form-based intake for merchants who prefer talking

### 2. Voice Dictation
- Microphone button on text fields (business description, highlights, description)
- Uses Web Speech API (browser-native, no backend needed)
- Transcription feeds into AI for cleanup/formatting

### 3. "Inspire Me" Everywhere
- Every text field has an "Inspire Me" button
- AI generates content based on: business category + name + existing text + market data
- "Share More Details" expands/improves existing text

### 4. Smart Photo Suggestions
- Based on category, suggest relevant stock photos
- Show category-specific example photos
- Future: AI-generated photos (out of scope but mentioned)

### 5. Recommended Discount Engine
- Shows recommended discount % based on market intelligence
- "Deals with 35-40% off in Beauty & Spas get 2x more views"
- Visual indicator comparing merchant's price to market average

### 6. Live Preview Throughout
- Right-side panel showing the deal as customers will see it
- Updates in real-time as merchant edits any field
- Toggle between desktop and mobile preview

### 7. Pipeline Transparency
- "How we generated this" expandable showing AI reasoning
- Confidence scores on AI-generated fields
- Low-confidence fields highlighted for review

---

## What we keep from current build

- FastAPI backend + pipeline architecture (4 endpoints)
- Admin panel (endpoint management, test panel, benchmarks)
- React + Tailwind + shadcn/ui frontend
- Plus Jakarta Sans typography
- Groupon green brand colors

## What we throw away and rebuild

- The 6-step intake form → replaced by Flow A (onboarding) + Flow B (deal creation)
- The single deal preview page → replaced by proper deal builder with sidebar nav + live preview
- The simplified MerchantLayout → replaced by full merchant portal with sidebar nav
- The Published page → replaced by proper dashboard with deal management

## Build Order

1. **Merchant portal shell**: sidebar nav, routing, dashboard home
2. **Business onboarding flow**: all A1-A9 pages
3. **Deal creation flow**: all B1-B7 pages with sidebar + live preview
4. **AI enhancements**: Inspire Me, voice dictation, smart suggestions
5. **Polish and test end-to-end**

---

## Decision: Scope vs Time

This is a significant rebuild. Estimated effort:
- Portal shell + routing: 30 min
- Business onboarding (9 pages): 2 hours
- Deal creation (7 pages with live preview): 3 hours
- AI enhancements: 1 hour
- Dashboard + management: 1 hour
- Polish: 1 hour

Total: ~8 hours of focused building.

This produces a complete merchant platform that can go head-to-head with Groupon's actual Merchant Center, but with AI assistance at every step. That's the case study: "We built a better version of what you have, and the AI makes it 10x faster for Sofia."
