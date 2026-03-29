# Interface Design System — Groupon AI Deal Creator

## Direction

Two audiences, one product. The merchant side is a **concierge** — warm, spacious, progressive. The admin side is a **workshop bench** — dense, labeled, tool-oriented. Both share Groupon green as the action color and the pipeline trace as the signature element.

## Feel

- Merchant: "Someone is handling this for me." Calm, confident, warm.
- Admin: "I can see exactly what's happening and tune it." Clear, functional, precise.

## Signature

**Pipeline trace** — the ability to see how the AI built the deal. Appears as expandable detail in the merchant preview and as the core interaction model in the admin test panel.

## Depth Strategy

**Borders-only with subtle surface shifts.** No drop shadows except on the merchant intake card (single elevated element deserves presence). Admin is fully flat with border separation. Borders use low-opacity rgba, never solid hex.

## Spacing

Base unit: **4px**. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Micro: 4-8px (icon gaps, badge padding)
- Component: 12-16px (within cards, between form fields)
- Section: 24-32px (between card groups)
- Major: 48-64px (between page sections)

## Color Tokens

### Shared
- `--groupon-green`: #53A318 — primary action, CTA, success
- `--groupon-green-dark`: #438a12 — hover state
- `--groupon-green-light`: #e8f5de — backgrounds, subtle fills
- `--groupon-purple`: #2B1A6B — header accent only

### Merchant (warm neutrals)
- `--surface-merchant`: #fafaf8 — page background (warm off-white)
- `--card-merchant`: #ffffff — card surfaces
- `--ink-primary`: #1a1a1a — headings
- `--ink-secondary`: #6b7280 — body text
- `--ink-tertiary`: #9ca3af — hints, metadata
- `--ink-muted`: #d1d5db — disabled, placeholder
- `--border-soft`: rgba(0,0,0,0.06) — card edges
- `--border-standard`: rgba(0,0,0,0.10) — section dividers

### Admin (cool neutrals)
- `--surface-admin`: #f8f9fa — page background (cool off-white)
- `--card-admin`: #ffffff — card surfaces
- `--ink-primary`: #111827 — headings (slightly darker, more contrast)
- `--ink-secondary`: #4b5563 — body text (higher contrast for data)
- `--border-admin`: rgba(0,0,0,0.08) — standard
- `--border-emphasis`: rgba(0,0,0,0.15) — focus, active states

### Semantic
- `--confidence-high`: #53A318 (green)
- `--confidence-mid`: #f59e0b (amber)
- `--confidence-low`: #ef4444 (red)
- `--info`: #3b82f6 — contextual banners
- `--info-surface`: #eff6ff
- `--warning`: #f59e0b — review flags
- `--warning-surface`: #fffbeb

## Typography

- **Headings**: Bricolage Grotesque Variable — geometric, characterful, tight tracking
- **Body**: DM Sans Variable — clean, warm, readable
- **Accent**: Instrument Serif — editorial moments (merchant hero only)
- **Data/Code**: system monospace — admin JSON displays, pipeline output

### Scale
- Page title: 24px / bold / -0.02em tracking
- Section heading: 18px / bold / -0.01em
- Card title: 15px / semibold
- Body: 14px / regular
- Label: 13px / medium / uppercase tracking for step indicators
- Small: 12px / regular — metadata, timestamps
- Micro: 11px / medium — badges, tags

## Component Patterns

### Admin Endpoint Card
- Pipeline step number in green rounded square (left)
- Title + description (center)
- Model/temp/token badges (bottom)
- Arrow icon (right, muted)
- Hover: border shifts to green/20, no shadow

### Admin Context Banner
- Left icon (info blue or amber warning)
- Title line (bold) + description (regular)
- Used at top of each admin page to explain purpose

### Merchant Intake Card
- Single elevated card (border + shadow)
- Step icon in green rounded square
- Step label (uppercase, tracking, muted)
- Question as heading
- Input with subtle inset background

### Service Suggestion Chip
- Green outline, green text
- Tap to add (fills to green bg, white text)
- Price range as secondary text

### Pipeline Trace (signature)
- Collapsible section
- Three columns (one per pipeline step)
- Step name, model badge, latency badge
- JSON output in mono, scrollable
