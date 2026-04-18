# Design Brief: Solo Dairy Farm

**Purpose**: Direct-to-consumer dairy marketplace. Builds trust through authentic farm identity, drives milk subscriptions and cow sales. Mobile-first for rural + urban customers.

## Tone & Differentiation
Organic heritage-craft aesthetic. Warm, earthy, trustworthy. NOT minimalist brutalism or futuristic tech. Every surface choice communicates authenticity and quality.

## Palette (OKLCH)

| Color | Role | Light (L C H) | Dark (L C H) |
|-------|------|---------------|----|
| Deep Green | Primary | 0.37 0.095 159 | 0.72 0.12 159 |
| Earthy Brown | Secondary | 0.47 0.15 35 | 0.65 0.18 35 |
| Field Green | Accent | 0.65 0.18 140 | 0.75 0.2 140 |
| Cream White | Background | 0.995 0 0 | 0.145 0 0 |
| Charcoal | Foreground | 0.15 0 0 | 0.95 0 0 |
| Pale Sage | Muted | 0.92 0.01 159 | 0.22 0 0 |

## Typography
Display: **Fraunces** (serif, distinguished, heritage). Body: **Figtree** (warm, approachable). Mono: **GeistMono** (backend only). Scale: 12/14/16/18/20/24/32px.

## Elevation & Depth
Cards: `border border-border shadow-md`, background white, soft depth. Header: deep green solid, strong visual anchor. Footer: earthy brown, white text. Alternating section backgrounds (cream/pale sage muted) for rhythm.

## Structural Zones

| Zone | Background | Border | Text | Notes |
|------|-----------|---------|------|-------|
| Header | Primary (deep green) | None | Primary-foreground (white) | Solid, no transparency |
| Hero | Background (cream) | Accent (field green) bottom | Foreground (charcoal) | Large imagery, centered |
| Content Cards | Card (white) | Border (pale sage) | Foreground (charcoal) | `card-elevated` utility |
| CTA Buttons | Accent (field green) | None | Charcoal text | Hover: opacity-90 |
| Footer | Secondary (earthy brown) | None | White text | Mirrored header weight |
| Sections | Alternating background/muted | None | Foreground | Every other section muted for rhythm |

## Spacing & Rhythm
Padding: `px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20` (section-padding utility). Gap: 1rem (md) / 1.5rem (lg). Radius: 8px (medium softness). Density: medium (simple, rural-friendly layout).

## Component Patterns
Buttons: `btn-primary` (field green bg, charcoal text) / `btn-secondary` (brown bg, white text). Cards: `card-elevated` (white bg, pale sage border, soft shadow). Forms: input `input` token (pale sage), focus ring primary color. Navigation: header nav with primary bg, white text. Mobile: hamburger below 768px.

## Motion
Transition: `transition-smooth` (0.3s cubic-bezier). Button hover: opacity-90. No bounce, no parallax. Simple fade-in on page load.

## Constraints
No gradients. OKLCH only, no hex/rgb literals. Rural-friendly: large touch targets (48px min), high contrast. Imagery emphasis: farm/cows/dairy visuals carry design weight.
