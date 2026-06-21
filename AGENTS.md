# AGENTS.md — LuluLab Web Project Guide

This file provides context and conventions for AI agents working on the LuluLab website. Read it before making changes.

## Project Overview

A static landing page for LuluLab, a HKUST-founded STEAM education lab. The website features a particle-based text animation system, an infinite scrolling brand-motto marquee, and a responsive layout.

**Key behavior**: On first load, the particle system plays an intro animation — particles appear at random positions, converge from left to right to form "think it. / build it. / break it. / fix it.", hold briefly, scatter outward with a fade, then converge into the LuluLab logo. After the intro completes at progress >= 0.87, scroll-based text transitions take over.

## File Structure

```
LuluLabWeb/
├── index.html         # Main entry — semantic HTML with 6 sections
├── AGENTS.md          # This file
├── css/
│   └── style.css     # All styles, CSS custom properties, responsive breakpoints
├── js/
│   └── script.js     # Particle system + infinite scroll component
├── pages/
│   └── booking.html  # Contact / booking page
└── images/           # Image assets (currently empty)
```

## Particle System (`js/script.js`)

### Architecture

- **Canvas full-viewport overlay** (`#particle-canvas`), fixed position, `pointer-events: none` so clicks pass through.
- **Particles** are small rects (`config.particleSize`) rendered each frame via `requestAnimationFrame`.
- **Text sampling**: `getPoints()` renders text on an offscreen canvas, scans pixels at `config.gap` intervals, and stores coordinates of non-transparent pixels. Multi-line text is handled by splitting on `\n`.
- **State machine**:
  1. `introActive = true` — runs the 4-phase intro, returns early from `updatePhysics()`.
  2. `introActive = false` — scroll-based transitions between `textSequence` entries.

### Intro Animation (duration: `INTRO_DURATION` = 8000 ms)

Particles start at random positions (`introRandomX`/`introRandomY` set in `createParticles()`). The intro has 4 phases:

| Progress | Phase | Behavior |
|---|---|---|
| 0.00–0.35 | Converge | Particles fly from random positions to text positions with **left-to-right sweep** based on `sweepX = p.introRandomX / canvas.width * 0.7`. Left-edge particles start immediately; right-edge particles start at delay ~0.7. Easing is easeOutBack (`1 + c3*(t-1)^3 + c1*(t-1)^2`). Alpha fades in with the ease. |
| 0.35–0.45 | Hold | Particles snap to exact text positions. Full opacity. |
| 0.45–0.70 | Scatter | Particles burst outward along random `scatterAngle`/`scatterDist` with linear progress. Alpha fades out quadratically (`1 - t*t`). |
| 0.70–0.87 | Reform | Particles converge from scattered positions to LuluLab logo positions with smoothstep easing (`t²(3-2t)`). Alpha ramps from 0.4 to 1.0. |

The intro ends when `progress >= 0.87`. At that point, `introActive` is set to `false`, `canvas.style.backgroundColor` is cleared so CSS takes over, and particles snap to LuluLab positions.

### Per-particle State (intro)

Each particle stores:
- `introRandomX`/`introRandomY` — fixed random start position (set once in `createParticles()`)
- `scatterAngle` — random angle for scatter direction
- `scatterDist` — random distance for scatter
- `introAlpha` — per-particle alpha used during intro rendering
- `size` — per-particle size (defaults to `config.particleSize`; set to `config.particleSize` for simplicity)

### Key Variables

| Variable | Value | Purpose |
|---|---|---|
| `INTRO_TEXT` | `'Think it.\nBuild it.\nBreak it.\nFix it.'` | Text for intro convergence (4 lines, split by `\n`) |
| `INTRO_DURATION` | `8000` | Total intro animation time in ms |
| `config.gap` | `6` | Pixel sampling interval for text to points |
| `config.particleSize` | `2.2` | Size of each rendered particle rect |
| `config.ease` | `0.08` | Spring-return coefficient per frame (used in scroll physics) |
| `g_introFontSize` | `80` (desktop) / `42` (mobile) | Font size for intro text |
| `g_introLineHeight` | `fontSize * 1.2` | Line spacing for 4-line intro text |
| `g_introCenterY` | computed in `init()` | Vertical center of the intro text block |

### Scroll-based Transitions

- `getCurrentTextAndProgress()` maps `window.scrollY` to a `{ currentText, nextText, progress }` triplet using each section's `offsetTop`.
- `updatePhysics()` uses `progress < 0.5` for dissolve (scatter from current text) and `progress >= 0.5` for reform (converge to next text).
- Dissolve and reform share the per-particle `scatterAngle` and `scatterDist` for visual continuity.
- Mouse interaction pushes particles away within `config.mouseRadius` (100px).

### Text Sequence

Defined in `textSequence[]`:
```
LuluLab → ABOUT → MODULES → PROJECTS → RESOURCES → CONTACT US
```

Each entry maps to a DOM `sectionId` so particle positions dynamically follow the actual section title positions.

### Background Color

- CSS defaults to `var(--primary-orange)`.
- During intro, JS overrides to `#000` (dark).
- After intro, inline style is cleared; CSS handles the orange to dark transition on scroll via `body.scrolled #particle-canvas`.

## Infinite Scroll Component

Defined at the bottom of `script.js` (`initInfiniteScroll()`). Renders 6 clones of "Dreamit Buildit Breakit Fixit" in alternating orange/white on 5 scroll lines. Uses GSAP for animation; 3 lines scroll left, 2 scroll right.

## Coding Conventions

- **Language**: JavaScript comments use a mix of English and Chinese.
- **Indentation**: Spaces (mostly 4-space, though some lines in the intro section use varying indentation).
- **DOM queries**: `querySelector` / `getElementById` — no framework.
- **Animation**: `requestAnimationFrame` loop (no setInterval). GSAP only for the infinite scroll.
- **State**: Global variables for particle state (e.g., `particles[]`, `introActive`, `mouse`). No class-based architecture.

## Important Behaviors to Preserve

1. **Intro plays once** on page load. Do not reset `introActive` on scroll events.
2. **Canvas size** resets on `resize` via `init()`, which regenerates all text points and recreates particles (intro replays on resize).
3. **`pointer-events: none`** on the canvas — never remove this; buttons and links sit behind the canvas overlay.
4. **`body.scrolled`** class is toggled only after intro completes (`!introActive`).
5. **Mobile scaling**: `textSequence` font sizes multiply by `0.55` when `window.innerWidth < 768`.
6. **Intro text** "think it. build it. break it. fix it." is split into 4 lines with `\n` in `INTRO_TEXT`. Each particle's `lineIndex` is computed in `createParticles()` by determining which text line its Y position falls within.
7. **Intro completion** at `progress >= 0.87` (not 1.0). Phase 4 runs only 56% of its full duration before particles snap to LuluLab positions.
8. **Canvas background** during intro is `#000` (set inline in `createParticles()`). After intro, the inline style is cleared so CSS `background-color: var(--primary-orange)` takes effect.

## Dependencies

- **Font Awesome 6.4.0** (CDN) — icons
- **GSAP 3.12** (CDN) — infinite scroll marquee animation only
- **No other external dependencies** — pure vanilla JS + CSS
