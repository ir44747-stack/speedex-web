# SPEEDEX — QATAR ↔ CHINA

A cinematic, trilingual Next.js website for SPEEDEX — a premium business consultancy and commercial-mediation firm for bidirectional trade between Qatar and China, complemented by A-to-Z Corporate Setup in Qatar.

The page is designed as one continuous scroll film rather than a stack of cards:

1. Immediate full-screen pinned HTML5 canvas — 202 preloaded image frames map scroll progress directly to frame index, with no preloader, no video element and no visible overlay copy
2. SPEEDEX gateway — the mission, operating promise, primary actions, route facts and animated telemetry counters appear as the canvas unpins
3. Who We Are and the asymmetric Swiss-editorial A-to-Z consultancy flow: bilateral sourcing/logistics, government setup, brand creation, premises setup, marketing and operations
4. Why Choose Us — reliability, 24/7 mediation, transparency and A–Z execution
5. China Gateway — factory access, quality control, consolidation and bilateral delivery across Qatar and China
6. Scroll-driven Qatar ↔ China trade film with a draggable gold seam, captioned at national-hub level
7. Editorial service index and five-checkpoint route
8. Interactive bidirectional Logistics Planning model (China → Qatar and Qatar → China)
9. Why Qatar? — Gulf access, air/sea infrastructure, business platforms and purchasing power
10. Company Setup Services — a structured formation framework with four client-defined service placeholders intentionally left blank
11. Arrival interlude into Corporate Setup
12. Client-requested interactive setup board — sharp architectural Blueprint/Reality stage, open five-stage checklist, precision slider/replay and staggered MOCI / QFC / QFZ platform ribbons
13. Full-screen Blueprint → Reality construction sequence
14. MOCI / QFC / QFZ platform index
15. Insights & Commercial Analysis — structured briefings on manufacturing, import regulation, logistics optimization and commercial mediation
16. Why SPEEDEX over a Qatar commercial skyline
17. Underline-only mandate/RFQ form and a minimal footer

## Stack

- **Next.js 15.5.28** (App Router, TypeScript)
- **React 19.1.1**
- **Tailwind CSS 4**
- **GSAP ScrollTrigger** for scrubbed scenes, parallax and reveals
- **Smooth** for physical smooth scrolling
- **next/image** for responsive AVIF/WebP photography

## Run

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000

Production verification:

```bash
npm run build
npm run start
npm audit
```

## Languages and themes

- English (LTR), Arabic (full RTL), Chinese
- Dark cinema theme and warm light editorial theme
- Preferences persist in `localStorage` as `spx-lang` and `spx-theme`
- Photographic chapters intentionally remain dark in light mode; reading surfaces, header and footer follow the theme

## Anti-template asymmetric glass / dynamic UI system

The emergency anti-template overhaul removes flat black text containers and replaces former rigid grids with asymmetric editorial composition and floating glassmorphism on deep maroon `#6B1D2F` and obsidian fields. Latin display type and the SPEEDEX wordmark use **Syne**, Arabic display/body type uses **Cairo**, and Latin body copy uses **Inter** (with Noto fallbacks for Chinese). Swiss nodes, glass ribbons/chips, platform and editorial rows, setup placeholders and the setup-board shell use asymmetric polygon cuts, layered maroon-obsidian gradients, backdrop blur, internal highlights and stronger depth. The clean fixed header (`[data-clean-header]` / `[data-floating-nav]`, 999px pill) contains only the four-layer pseudo-3D SPEEDEX emblem, six unnumbered destinations — Trade Corridor, Logistics Planner, Corporate Setup, China Gateway, Why Qatar and Insights & Editorial — the EN/عربي/中文 switcher, a small-screen menu button and one `#6B1D2F` **Initiate Mandate** capsule (`طلب تفويض مؤسسي`). It contains no theme toggle; the Day/Night control remains in the footer as `[data-footer-theme-control]`. The navigation label remains shortened to “China Gateway”; the section heading retains “China Gateway & Why China”.

GSAP/ScrollTrigger animates staggered sibling reveals, data-meter fills, numeric `[data-count]` counters, editorial drift and slow orbital rings with transform/opacity only. Fine-pointer interaction adds pointer-tracked glare through `--pointer-x` / `--pointer-y` on 33 reactive modules and restrained 3D tilt to 18 glass/platform modules, resetting cleanly on leave. Gateway telemetry settles at 2 nations, 3 languages, 5 disciplines and 24/7 mediation; strategic-node readouts count to their meter values. Reduced-motion variants show final counter values. Planner bars scale from their baseline, and the live container/consolidation simulator uses a transform-scaled fill with sea `40HQ envelope` / air `ULD envelope` labels rather than changing layout dimensions. The latest production build is 94.7 kB for `/` and 197 kB first-load JS, with the production dependency audit at 0 vulnerabilities. The final 27-check browser suite passes on both canonical port 3000 and static port 4174 with `ERRORS []`; evidence is stored at `/home/user/SPEEDEX-Emergency-AntiTemplate-Overhaul-QA.jpg`.

## Project map

```text
app/
  layout.tsx              Metadata, multilingual font stack, no-flash theme script
  page.tsx                Server shell
  globals.css             #6B1D2F / #C5A059 / #070709 / #140A0F tokens, Syne/Cairo/Inter system and asymmetric glass surfaces
components/
  Experience.tsx          Language/theme state, Smooth, GSAP staggered reveals, counters, pointer glare and glass tilt
  Nav.tsx                 Clean detached floating pill with exact six-link composition, layered 3D emblem and mandate capsule
  DayNightToggle.tsx      Footer-hosted luxury animated day/night pill switch
  SpeedexMark.tsx         Clean inline SVG gazelle-over-globe mark
  Hero.tsx                Pinned 202-frame canvas sequence, post-pin marquee and gateway mission
  ConsultancyOverview.tsx Who We Are and five-discipline asymmetric editorial consultancy flow
  StrategicSections.tsx   Why Choose Us, China Gateway, Why Qatar and Company Setup Services
  TradeJourney.tsx        Scroll film, service index, checkpoints
  Planner.tsx             Bidirectional planner, hub sets and live container/ULD volume simulator
  CorporateSetup.tsx      Arrival interlude, interactive setup board, Blueprint → Reality, legal platforms
  Insights.tsx            Four localized commercial-analysis briefings
  Closing.tsx             Why SPEEDEX, RFQ, footer and the footer-only Day/Night control
lib/
  i18n.ts                 Complete EN / AR / ZH dictionary
public/assets/
  frames/                 202 WebP hero frames (frame-000.webp … frame-201.webp)
  beijing-cbd-real.jpg
  doha-west-bay-real.jpg
  doha-skyline-real.jpg
  speedex-mark.svg
  speedex-mark-white.svg
```

## Brand mark

The header does not use the old raster logo or a rough auto-trace. `SpeedexMark.tsx` is a hand-smoothed vector reconstruction: the supplied logo’s bright front face was isolated, converted to a clean Bézier gazelle silhouette, and paired with a geometrically drawn wireframe globe. It inherits `currentColor`, so the same transparent mark renders in luminous maroon on dark glass and deep maroon on light glass. Standalone maroon and white SVGs are in `public/assets/`.

## Photography and hero canvas

The opening now uses the frame sequence from `https://github.com/ir44747-stack/speedex` (branch `main`, commit `8f60ad3`). That repository stores 202 PNGs at its root, not in a `frames/` folder. The PNGs total about 89.22 MiB, so the deployable site uses dimension-preserving WebP derivatives at the original 1024×576 size: quality 84, method 6, 202 files, 7.91 MiB total, in `public/assets/frames/`.

`Hero.tsx` decodes the first available frame, creates the pinned scene, then preloads every remaining frame asynchronously with 10 workers into in-memory `HTMLImageElement` objects. Drawing is rAF-coalesced through a plain GSAP proxy (`{ frame: 0 }`), never React state per frame. ScrollTrigger uses `start: "top top"`, `end: "+=3000"`, `scrub: true`, `pin: true`, `pinSpacing: true` and `anticipatePin: 1`; scroll progress maps linearly from frame 0 to frame 201 and reverses exactly. The fullscreen canvas is cover-cropped with device-pixel ratio capped at 2, and a nearest-loaded-frame fallback prevents a blank surface during early scrolling. Its scoped `.hero-canvas-sharp` presentation layer references the inline `#speedex-ultimate-4k` SVG convolution/colour filter plus `contrast(1.12) saturate(1.08)` and crisp-edge rendering; this increases perceived acutance without changing or upscaling the underlying 1024×576 source frames. There is no preloader and no visible title, subtitle, CTA, progress UI or header over the pinned sequence. After it unpins, the marquee gives way to `#gateway`, whose formal corporate mission is: “Your trusted commercial gateway between Qatar and China.” Arabic: “بوابتك التجارية الموثوقة بين قطر والصين”. The source sequence is natively 1024×576, so fullscreen sharpness is bounded by those supplied frames. A visually hidden H1 remains only for semantics/SEO. The former MP4/poster are preserved outside the deployable public folder in `/home/user/SPEEDEX-ARCHIVED-VIDEO/` and are not referenced by the site.

The trade and corporate chapters continue to use real, high-resolution China and Qatar skyline photography; visible captions describe national industrial/commercial hub networks rather than a capital-to-capital route. See `IMAGE-CREDITS.md` for authors, Wikimedia Commons sources, licences and edits. Visible credits are also rendered beneath the relevant scenes and in the footer.

## Production notes

- The RFQ currently generates the client reference in-browser, preserving the intended UX. Connect it to an email/CRM/WhatsApp endpoint before launch.
- Planner figures are indicative planning economics for both directions. Replace them with SPEEDEX’s approved Qatar ↔ China rate card in `components/Planner.tsx`.
- Corporate-setup copy is positioning copy, not legal advice; have current Qatar counsel review activities, timelines and fees.
- Set the final canonical domain in metadata before deployment (see `app/layout.tsx`).
- Confirm commercial image/architecture rights for the launch jurisdiction; details and a Qatar freedom-of-panorama caution are documented in `IMAGE-CREDITS.md`.

Full developer handover: `ARCHITECTURE.md` in this folder and `../SPEEDEX-Architecture-and-Handover.md` in the workspace root.
