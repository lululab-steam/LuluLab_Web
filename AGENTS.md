 # AGENTS.md — LuluLab Web Project Guide

 This file provides context and conventions for AI agents working on the LuluLab website. Read it before making changes.

 ## Project Overview

 A static landing page for LuluLab, a HKUST-founded STEAM education lab. The website features a particle-based text animation system, an infinite scrolling brand-motto marquee, and a responsive layout.

 **Key behavior**: On first load, the particle system plays an 8-second intro animation — particles converge from random positions to form "think it. build it. break it. fix it.", hold briefly, scatter outward with a fade, then reform into the LuluLab logo. After the intro, scroll-based transitions take over.

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
 - **Text sampling**: `getPoints()` renders text on an offscreen canvas, scans pixels at `config.gap` intervals, and stores coordinates of non-transparent pixels.
 - **State machine**:
   1. `introActive = true` — runs the 4-phase intro, returns early from `updatePhysics()`.
   2. `introActive = false` — scroll-based transitions between `textSequence` entries.

 ### Intro Phases (duration: `INTRO_DURATION` = 8000 ms)

 | Progress | Phase | Behavior |
 |---|---|---|
 | 0.00–0.35 | Converge | Particles lerp from `introRandomX/Y` toward "think it..." text with smoothstep easing + fade-in |
 | 0.35–0.45 | Hold | Particles hold at "think it..." position at full opacity |
 | 0.45–0.70 | Scatter | Particles burst outward along `scatterAngle`/`scatterDist`, fade out quadratically |
 | 0.70–1.00 | Reform | Particles converge to LuluLab positions, fade back in |

 After completion, `canvas.style.backgroundColor` is cleared so CSS transitions take over.

 ### Scroll-based Transitions

 - `getCurrentTextAndProgress()` maps `window.scrollY` to a `{ currentText, nextText, progress }` triplet using each section's `offsetTop`.
 - `updatePhysics()` uses `progress < 0.5` for dissolve (scatter from current text) and `progress >= 0.5` for reform (converge to next text).
 - Dissolve / reform share the per-particle `scatterAngle` and `scatterDist` for visual continuity.
 - Mouse interaction pushes particles away within `config.mouseRadius` (100px).

 ### Text Sequence

 Defined in `textSequence[]`:
 LuluLab → ABOUT → MODULES → PROJECTS → RESOURCES → CONTACT US

 Each entry maps to a DOM `sectionId` so particle positions dynamically follow the actual section title positions.

 ### Background Color

 - CSS defaults to `var(--primary-orange)`.
 - During intro, JS overrides to `#000` (dark).
 - After intro, inline style is cleared; CSS handles the orange→dark transition on scroll via `body.scrolled #particle-canvas`.

 ## Infinite Scroll Component

 Defined at the bottom of `script.js` (`initInfiniteScroll()`). Renders 6 clones of "Dreamit Buildit Breakit Fixit" in alternating orange/white on 5 scroll lines. Uses GSAP for animation; 3 lines scroll left, 2 scroll right.

 ## Coding Conventions

 - **Language**: JavaScript comments and variable names use English (agent-facing code) / Chinese (inline documentation).
 - **Style**: Spaces for indentation (4-space). No semicolons are required but existing code uses them.
 - **DOM queries**: `querySelector` / `getElementById` — no framework.
 - **Animation**: `requestAnimationFrame` loop (no setInterval). GSAP only for the infinite scroll.
 - **State**: Global variables for particle state (e.g., `particles[]`, `introActive`, `mouse`). No class-based architecture.

 ## Important Behaviors to Preserve

 1. **Intro plays once** on page load. Do not reset `introActive` on scroll events.
 2. **Canvas size** resets on `resize` via `init()`, which regenerates all text points and recreates particles (intro replays on resize).
 3. **`pointer-events: none`** on the canvas — never remove this; buttons and links sit behind the canvas overlay.
 4. **`body.scrolled`** class is toggled only after intro completes (`!introActive`).
 5. **Mobile scaling**: `textSequence` font sizes multiply by `0.55` when `window.innerWidth < 768`.
 6. **Intro text** "think it. build it. break it. fix it." is split into 4 lines with `\n` and rendered by `getPoints()` which splits on newlines.

 ## Key Constants (script.js)

 | Constant | Value | Purpose |
 |---|---|---|
 | `INTRO_TEXT` | `'think it.\\nbuild it.\\nbreak it.\\nfix it.'` | Text for intro convergence |
 | `INTRO_DURATION` | `8000` | Total intro animation time in ms |
 | `config.gap` | `6` | Pixel sampling interval for text → points |
 | `config.particleSize` | `2.2` | Size of each rendered particle rect |
 | `config.ease` | `0.08` | Spring-return coefficient per frame |

 ## Dependencies

 - **Font Awesome 6.4.0** (CDN) — icons
 - **GSAP 3.12** (CDN) — infinite scroll marquee animation only
 - **No other external dependencies** — pure vanilla JS + CSS
