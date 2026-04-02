# Groupon Design Reference Notes

*Extracted from screenshots of groupon.com (March 2026) for the merchant-facing UI.*

## Color Palette (from consumer site)

- **Groupon Green (primary CTA):** ~#53A318 — search buttons, "Buy Now", "Buy Again", links
- **Dark purple/indigo (header):** ~#2B1A6B — top promo banner, navigation background
- **White:** page backgrounds, card backgrounds
- **Light gray:** borders, dividers, secondary backgrounds
- **Dark gray/black:** heading text, primary text
- **Medium gray:** description text, secondary info
- **Gold/yellow:** star ratings
- **Red/green accent:** discount percentages, urgency timers, promo codes

## Typography

- Clean sans-serif (system font stack)
- Bold, dark headings
- Gray secondary/description text
- Breadcrumb navigation in muted blue links

## Deal Card Pattern

```
[Image]
Business Name (green link)
Deal Title (bold, black, 2 lines max)
Location, Distance
★★★★☆ 4.2 (702)
~~$69~~ $49
$44.10  -36%  Limited time
$39.69 with code SPRING
```

## Deal Detail Page Pattern

```
Breadcrumb: Category > Subcategory > Type
Title: "Service at Business Name (Up to X% Off)"
Business name + rating + review count
[Large image with thumbnails below]
[Share + Wishlist icons]

Right sidebar:
  - Urgency: "Sale ends in X days"
  - Promo banner
  - Select Option (radio buttons):
    - Option name
    - ~~Original~~ Deal price
    - $XX  -XX%  Extra $X off
    - Promo code line
    - Quantity selector
    - "X,XXX+ bought"
  - "Buy As a Gift" | "Buy Now" buttons

Below image:
  Tabs: About | Need To Know Info | FAQs | Reviews
```

## Current Campaign Builder (what we're replacing)

Left sidebar stepper:
1. Options ✓
2. Proof of pricing ✓
3. Photos (current)
4. Highlights
5. Description
6. Fine print
7. Voucher instructions
8. Documents
9. Business info
10. Review
11. Submit 🔒

**This is exactly the friction** — 11 steps, many fields Sofia doesn't know how to fill.

## Design Principles for Our Prototype

### Merchant-facing UI (Sofia's experience):
- Use Groupon green as the primary action color
- White backgrounds, clean cards
- Match the deal detail page layout for the preview
- Warm, professional tone — not clinical

### Admin panel (PM's workbench):
- Keep neutral/functional (already built this way)
- Does NOT need to match Groupon's brand

### What NOT to do:
- Don't replicate the full Groupon header/nav (we're not building the platform)
- Don't use the old Campaign Builder aesthetic (that's what we're improving)
- Don't over-brand — the prototype should feel like a natural extension, not a copycat
