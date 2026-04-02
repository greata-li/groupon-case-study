# Groupon Merchant Platform — Design System

Extracted from codebase on 2026-04-02. 39 files, 11,904 lines of UI code.

## Direction

A merchant-facing platform that mirrors Groupon's actual merchant portal. Professional, functional, information-dense. Feels like a real SaaS tool — not a prototype or marketing site. The Groupon green brand anchors everything; neutrals do the structural work.

## Color Palette

### Brand
- `groupon-green`: #53A318 — primary actions, active states, brand identity
- `groupon-green-dark`: #438a12 — hover states on green buttons
- `groupon-green-light`: #e8f5de — light backgrounds, active nav items, success banners
- `groupon-purple`: #2B1A6B — prototype indicator bar only

### Neutrals
- `white` — card surfaces, modal backgrounds
- `gray-50` — page backgrounds, input backgrounds, alternate surfaces
- `gray-100` — secondary backgrounds, disabled states
- `gray-200` — borders (primary), dividers
- `gray-100` — borders (lighter, inner dividers)

### Text Hierarchy
- `gray-900` — primary text, headings (166 uses)
- `gray-700` — secondary emphasis (47 uses)
- `gray-600` — supporting text (60 uses)
- `gray-500` — body text, descriptions (176 uses)
- `gray-400` — metadata, placeholders, muted (158 uses)
- `gray-300` — decorative, disabled icons (23 uses)
- `white` — on colored backgrounds (87 uses)

### Semantic
- **Active/Success:** `bg-groupon-green/10 text-groupon-green`
- **Draft/Warning:** `bg-amber-50 text-amber-600`
- **Error/Destructive:** `bg-red-50 text-red-500`
- **Info:** `bg-blue-50 text-blue-600`
- **Inactive:** `bg-gray-100 text-gray-500`

## Typography

**Font:** Plus Jakarta Sans Variable (heading + body)

### Size Scale (by frequency)
| Token | Tailwind | Usage |
|-------|----------|-------|
| Body | text-sm | 315 uses — default body text |
| Caption | text-xs | 230 uses — labels, badges, metadata |
| Subtitle | text-base | 44 uses — section titles in content |
| Title | text-lg | 33 uses — card/section headings |
| Display | text-2xl | 33 uses — page-level headings |
| Hero | text-xl | 16 uses — large section headings |
| Stat | text-3xl | 5 uses — metric numbers |

### Weight
- `font-bold` — headings, labels, buttons (221 uses)
- `font-medium` — nav items, secondary emphasis (131 uses)
- `font-extrabold` — hero text, stat numbers (28 uses)
- `font-semibold` — occasional emphasis (22 uses)

### Heading Pattern
All headings use `font-heading` class (maps to Plus Jakarta Sans).
Page titles: `font-heading text-xl font-bold text-gray-900`
Section titles: `font-heading text-base font-bold text-gray-900`
Card titles: `text-sm font-bold` or `text-base font-bold`

## Spacing

**Base unit:** 4px (Tailwind default)

### Gap Scale (component spacing)
| Token | Value | Usage |
|-------|-------|-------|
| gap-1 | 4px | 51 — tight icon gaps |
| gap-2 | 8px | 130 — default component gap |
| gap-3 | 12px | 79 — comfortable spacing |
| gap-4 | 16px | 50 — card/section gaps |
| gap-6 | 24px | 15 — major section separation |

### Stack Scale (vertical rhythm)
| Token | Value | Usage |
|-------|-------|-------|
| space-y-1 | 4px | 11 |
| space-y-2 | 8px | 24 |
| space-y-3 | 12px | 15 |
| space-y-4 | 16px | 31 — default stack |
| space-y-6 | 24px | 22 — section separation |

### Page Padding
- Portal pages: `p-4 sm:p-6` (responsive)
- Merchant pages: `px-4 sm:px-6`
- Max widths: `max-w-5xl` (portal), `max-w-6xl` (merchant), `max-w-7xl` (admin)

## Depth Strategy

**Borders-first.** 519 border instances vs 50 shadow instances (10:1 ratio).

### Borders
- `border border-gray-200` — card outlines, section containers
- `border-b border-gray-200` — header dividers (48 uses)
- `border-b border-gray-100` — inner list dividers
- `border-t border-gray-100` — section separators
- `border-dashed border-gray-200` — "add" action areas

### Shadows (used sparingly for elevation)
- `shadow-sm` — cards needing slight lift (24 uses)
- `shadow-lg` — hover states, modals (11 uses)
- `shadow-md` — medium emphasis (11 uses)
- `shadow-xl` — hero CTA button (4 uses)

### Rule
Use borders for structure. Shadows only for interactive lift (hover cards, CTAs, modals).

## Border Radius

| Token | Usage | Context |
|-------|-------|---------|
| rounded-lg | 175 (45%) | Buttons, inputs, cards, badges |
| rounded-xl | 116 (30%) | Containers, larger cards, banners |
| rounded-2xl | 14 | Feature cards, hero elements |
| rounded-full | 58 | Avatars, pills, icon containers |
| rounded-md | 9 | Small elements, select inputs |

**Default:** `rounded-lg` for most interactive elements. `rounded-xl` for containers.

## Component Patterns

### Buttons (107 instances)
```
Primary:    rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark
Outline:    variant="outline" rounded-lg
Ghost:      variant="ghost"
Sizes:      sm (42), default, lg (1)
Heights:    h-8 (compact), h-10 (default), h-14 (hero CTA)
```

### Cards (152 instances)
```
Default:    <Card> with border-gray-200
Header:     <CardHeader className="border-b">
Title:      <CardTitle className="text-base font-bold">
Content:    <CardContent> (default padding from component)
```

### Badges
```
Status:     bg-{color}/10 text-{color} border-0 text-xs font-bold
Count:      variant="secondary" text-xs
```

### Tables
```
Container:  rounded-xl border border-gray-200 bg-white overflow-x-auto
Row hover:  hover:bg-gray-50/50 transition-colors
Hidden col: hidden sm:table-cell (responsive column hiding)
```

### Empty States
```
Container:  py-16 text-center
Icon:       mx-auto mb-4 h-14 w-14 rounded-2xl bg-groupon-green/10
Heading:    font-heading text-lg font-bold text-gray-900
Body:       text-sm text-gray-500
CTA:        mt-6 rounded-lg bg-groupon-green
```

## Icons

**Library:** Lucide React

| Size | Class | Usage | Context |
|------|-------|-------|---------|
| Micro | h-3 w-3 | 64 (18%) | Inline badges, tiny indicators |
| Small | h-4 w-4 | 159 (44%) | Buttons, nav items, inline |
| Medium | h-5 w-5 | 54 (15%) | Standalone icons, feature cards |
| Large | h-10 w-10 | 13 | Card accent icons |
| XL | h-12+ w-12+ | 12 | Empty states, hero sections |

## Layout Patterns

### Navigation
- **Portal sidebar:** Fixed 240px, hidden on mobile with hamburger toggle
- **Merchant header:** Horizontal nav, collapses to hamburger on mobile
- **Admin tabs:** Horizontal tab bar with `overflow-x-auto`

### Responsive Breakpoints
- Mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Grids: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` pattern
- Sidebars: Hidden below `lg:` or `md:`, overlay on mobile
- Tables: `overflow-x-auto` wrapper, column hiding with `hidden sm:table-cell`

### Content Layout
- Flex-based (516 instances) over grid (120 instances)
- `items-center` (328), `justify-between` (54) most common flex patterns
- Sticky headers: `sticky top-0 z-20`
- Sticky sidebars: `sticky top-20` (desktop only, `lg:sticky` pattern)

## Interactive States

### Hover
- Buttons: `hover:bg-groupon-green-dark` (primary), `hover:bg-gray-50` (ghost)
- Cards: `hover:border-groupon-green/20 hover:shadow-lg hover:shadow-groupon-green/5`
- Nav items: `hover:bg-gray-50 hover:text-gray-900`
- Table rows: `hover:bg-gray-50/50 transition-colors`

### Active/Selected
- Nav: `bg-groupon-green-light text-groupon-green`
- Tabs: `border-groupon-green text-groupon-green` (bottom border)

### Transitions
- Default: `transition-colors` (most common)
- Cards: `transition-all` (for shadow + border changes)

## Animation

- Page entrance: `animate-fade-in-up` (0.5s ease-out, translateY 12px)
- Staggered children: `stagger-children` class (80ms delay per child)
- Loading: `animate-spin` on Loader2 icon
- Button hover: `group-hover:translate-x-1` on arrow icons
