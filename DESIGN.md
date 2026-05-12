# Thadeus Tristan — Portfolio Design Overview

## Fonts
- **Space Grotesk** (weights 300–700) — headings, titles, UI labels
- **JetBrains Mono** (weights 300–500) — metadata, counters, tool tags, monospace labels

---

## Stage Flow

```
Loading Screen  →  Theatre (desktop) / Mobile View  →  Film Strip  →  Project Page
```

All stages are full-screen fixed overlays. Transitions between stages use Framer Motion (opacity/scale) and anime.js (screen tear).

---

## 1. Loading Screen

**Layout — centered column:**
- Full-screen background
- **Top edge:** horizontal film strip bar spanning full width
  - Two sprocket-hole rows (top and bottom of bar)
  - Frame counter number row between them
- **Camera data row** (centered, horizontal): `ISO 400 | 1/60s | f/2.8 | ● REC`
- **Leader circle** (210×210px SVG, centered):
  - Outer ring with 24 spoke lines radiating from center
  - Rotating scan line (animated)
  - Crosshair lines (vertical + horizontal)
  - 60-tick outer ring (major every 5)
  - Mid ring
  - Inner filled circle
  - Four cardinal accent circles at top/bottom/left/right
  - Corner bracket marks at four diagonal positions
  - Center dot
  - **Countdown number** (5→1) overlaid at center, animates in/out each frame
- **Title block** (below circle):
  - `THADEUS TRISTAN` — large spaced caps
  - `─── SELECTED WORKS ───` — smaller spaced mono
- **Bottom edge:** mirror of top film strip bar
- **Overlays (full-screen):** scanline texture, white flash pulse between count frames

**Assets:** none (all SVG/CSS)

---

## 2. Theatre Scene (Desktop only)

**Layout — full-screen WebGL canvas (React Three Fiber):**
- 3D cinema interior loaded from `public/Theatre.glb`
- **Cinema screen** (centred, background plane):
  - Plays `public/assets/HotSauceAd.mp4` on loop, contained with black bars
  - Film burn shader overlay (procedural noise, additive blend)
  - Subtle emissive flicker animation
- **Velvet curtains** (left + right, 16 folds each with pelmet + gold rod)
- **Proscenium arch** (left column, right column, top beam)
- Raked seat rows (6 rows, 6–11 seats each)
- Room walls: screen wall, back wall, left wall, right wall — each with wainscoting
- Ceiling with cove, crown strip, angled drop
- Pilasters on left + right walls
- Horizontal wall rails (upper + lower)
- Ceiling cornices
- Aisle step-lights (amber, both sides)
- Wall sconces with glow discs (both sides, 3 per side)
- **Lighting:** single spotlight from above pointed at screen; ambient implied by emissive materials
- **Dust particles** (`DustParticles.jsx`) floating in the air
- **Grain overlay** (`GrainOverlay.jsx`) — full-screen CSS film grain texture
- **Camera:** starts at `[0, 3.4, 9.5]`, mouse parallax (subtle x/y drift), looks at screen center
- **Interaction:** clicking the screen triggers a GSAP zoom animation (`[0,1.2,-0.6]`) then transitions to Film Strip

**Assets:** `public/Theatre.glb`, `public/assets/HotSauceAd.mp4`

---

## 3. Film Strip View (Desktop)

**Entrance animation:** white screen-tear (two panels spring apart top/bottom, revealing the view underneath)

**Layout — full-screen fixed column:**

```
┌─────────────────────────────────────────────────┐
│  ← back    THADEUS TRISTAN · SELECTED WORKS   [Animation] [Art] [VFX]  │
├─────────────────────────────────────────────────┤
│                                                 │
│   [Category label — large spaced caps]          │
│                                                 │
│   ┌──────────────────┐   [Year]                 │
│   │                  │   [Project title]         │
│   │   Media panel    │   [Description]           │
│   │   (55% width)    │   [Tool tags]             │
│   │                  │   [VIEW PROJECT ↗]        │
│   └──────────────────┘                          │
│                                                 │
├─────────────────────────────────────────────────┤
│  ←   [01 Title] [02 Title] [03 Title] ...   →   │
└─────────────────────────────────────────────────┘
```

**Header (flex row, space-between):**
- Left: `← back` button
- Center: `THADEUS TRISTAN · SELECTED WORKS` wordmark
- Right: category nav (`Animation` / `Art` / `VFX`)

**Category nav (CategoryNav.jsx):**
- Horizontal button row
- Active category: full white, underline in project accent colour
- Inactive: muted white
- Click animates a bounce scale on the button

**Carousel content area (FilmTapeCarousel.jsx):**
- **Category label** — large spaced uppercase at top, per-character stagger animation on category change
- **Content row (flex):**
  - **Media panel** (55% width, fixed max-height 460px): shows `media[0]` — video autoplay or image
  - **Meta panel** (remaining width, flex column):
    - Year — small mono caps
    - Title — large heading with per-character stagger entrance
    - Description — small paragraph
    - Tool tags — small mono bordered pills
    - `VIEW PROJECT ↗` — bordered button, hover fills with accent tint
- **Transitions:** slide + fade (exit left/right, enter from opposite side)

**Bottom navigation bar (flex row, centered):**
- `←` arrow (if >1 project)
- Project tabs row: each tab shows `01` number above project title, active tab has accent-coloured underline
- `→` arrow (if >1 project)

**Background:** per-project dark-tinted colour (`colorBg`), transitions smoothly on project change  
**Vignette:** radial gradient overlay on edges  
**Accent colour:** per-project vivid colour (`color`) used for category label, underlines, pill borders, button borders

**Assets:** `public/assets/*.mp4` and `public/assets/*.png` (per project — see projects list below)

---

## 4. Project Page

**Entrance animation:** scale + fade (Framer Motion)

**Layout — full-screen fixed column:**

```
┌─────────────────────────────────────────────────┐
│  ← back           THADEUS TRISTAN               │
├─────────────────────────────────────────────────┤
│                                                 │
│               Hero media (52% height)           │
│       [corner marks]          [Category · Year] │
│                                                 │
├─────────────────────────────────────────────────┤
│  [thumb] [thumb] [thumb] ...  (gallery strip)   │
├──────────────────┬──────────────────────────────┤
│                  │  Description                 │
│  Project title   │  Tool tags                   │
│  (42% width)     │  VIEW PROJECT ↗ / COMING SOON│
│                  │                              │
└──────────────────┴──────────────────────────────┘
```

**Header:**
- Left: `← back` button
- Center: `THADEUS TRISTAN` wordmark
- Right: spacer (balanced layout)

**Hero media (flex 0 0 52% height):**
- Video (autoplay, loop, muted) or image, `object-fit: cover`
- `key` on media element forces remount when gallery selection changes
- Four decorative corner bracket marks (SVG-style borders, accent colour)
- Bottom-left tag: `Category · Year`

**Gallery strip** (shown only if project has >1 media item):
- Horizontal scrollable row of thumbnails (96×58px each)
- Active thumb: accent-coloured border, full opacity
- Inactive: muted border, 45% opacity
- Each thumb shows video frame or image + label below
- Clicking switches the hero media

**Info section (flex row):**
- Left panel (42% width): project title (large, accent colour), vertically centred
- Right panel (remaining): description, tool pills, link button or "coming soon" label

**Escape key closes** the page

**Assets:** per-project media array (videos + images from `public/assets/`)

---

## 5. Mobile View (phones / tablets)

**Layout — full-screen fixed column:**

```
┌────────────────────┐
│ THADEUS TRISTAN    │
│ SELECTED WORKS     │
├────────────────────┤
│ Animation | Art | VFX │
├────────────────────┤
│ [card] [card]      │
│ [card] [card]      │
│ [card] [card]      │
│   (scrollable)     │
└────────────────────┘
```

**Header:** wordmark + sub-label  
**Category tabs:** horizontal scrollable row, active tab has coloured underline  
**Project grid:** 2-column CSS grid, each card has:
- 4:3 thumbnail area (colour placeholder — no media loaded)
- Project title
- Year

Tapping a card opens the Project Page (same component as desktop).  
No Three.js loaded on mobile.

**Assets:** none in grid (placeholder colours only); Project Page loads media on tap

---

## Projects & Assets

| Project | Category | Primary asset | Additional assets |
|---|---|---|---|
| Fool's Gold | Animation | `fools-gold.mp4` | `fools-gold-process.mp4`, `fools-gold-thumb.png`, `fools-gold-thumb2.png` |
| Star Dunes | Animation | `star-dunes.mp4` | `star-dunes-process.mp4`, `star-dunes-thumb.png`, `star-dunes-thumb2.png` |
| Moonlace Butterfly | Animation | `moonlace.mp4` | `moonlace-process.mp4`, `moonlace-thumb.png` |
| Heldberg's Hot Sauce | Animation | `HotSauceAd.mp4` | — |
| Realistic Render | Art | `realistic-01.png` | `realistic-a.png`, `realistic-b.png`, `realistic-c.png`, `realistic-d.png` |
| Cyberpunk Workshop | Art | `cyberpunk-ship.mp4` | `blimp.mp4` |
| Camera Tracking | VFX | `camera-tracking.mp4` | — |

**Cinema screen asset:** `HotSauceAd.mp4` (also used as a portfolio project)  
**3D scene asset:** `Theatre.glb`

---

## Global Overlays (always present)

- **GrainOverlay** — full-screen CSS animated film grain texture, low opacity, pointer-events none
