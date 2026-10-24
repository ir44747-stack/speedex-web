# SPEEDEX v2 — Technical Architecture

## 1. Experience architecture

The site is one Next.js route whose scroll position acts as the film timeline.

```text
Immediate Hero: pinned canvas image sequence — scroll progress = frame index
        ↓ Smooth + GSAP
Gateway mission → Who We Are → asymmetric A-to-Z consultancy flow
        ↓
Why Choose Us → China Gateway
        ↓
01 Trade film (sticky, scrubbed) → services → checkpoints → planner
        ↓
Why Qatar? → Company Setup Services (four blank client-input slots)
        ↓ arrival interlude
02 Setup board + corporate film (sticky, scrubbed) → legal platforms
        ↓
Insights & Commercial Analysis → Why SPEEDEX → RFQ → footer
```

There are no generic image cards, legacy template cells or flat black text boxes in the UI. Media is full-bleed: a pinned canvas sequence, split cinematic photography, or a low-opacity chapter backdrop. The emergency anti-template layer in `app/globals.css` (`.swiss-node`, `.data-meter`, `.glass-ribbon`, `.glass-ribbon-dark`, `.glass-chip`, `.platform-ribbon`, `.editorial-row`, `.setup-placeholder`) replaces enclosed grids with staggered open nodes and floating polygon-clipped glass over deep maroon and obsidian gradients. Oversized outlined indices, one-sided hairlines, backdrop blur, internal highlights, signal bars and scroll-built meter fills carry the hierarchy. Numeric `[data-count]` readouts, gateway telemetry, pointer glare and the planner volume simulator make the data layer interactive without returning to enclosed dashboard cards.

## 2. Rendering model

| Layer | Implementation |
|---|---|
| Server shell | `app/layout.tsx` and `app/page.tsx` render metadata, fonts and the client experience shell. The route is statically prerendered. |
| Client experience | `components/Experience.tsx` owns language, theme, Smooth lifecycle and global GSAP reveals/parallax; it starts immediately with no loading gate. |
| Images | `next/image` serves responsive AVIF/WebP derivatives of the three real city photographs. |
| Hero sequence | `Hero.tsx` renders a fullscreen HTML5 `<canvas>` from 202 local WebP files in `public/assets/frames/`. They are quality-84 derivatives of the 202 root PNGs in `https://github.com/ir44747-stack/speedex` (commit `8f60ad3`); source PNG total ≈89.22 MiB, deployed WebP total 7.91 MiB, each frame 1024×576. |
| Motion safety | `prefers-reduced-motion` disables Smooth and the hero pin/scrub sequence and prevents decorative GSAP states from hiding content. |

Current production route output: `/` is static, 94.7 kB route size and 197 kB first-load JS at the time of handover.

## 3. Scroll choreography

### Smooth

`Experience.tsx` creates Smooth on mount; there is no preloader or entry gate. Smooth uses native scrolling, while GSAP ticker calls `lenis.raf(...)` and `ScrollTrigger.update` runs on Smooth scroll. Anchor clicks are intercepted and routed through `lenis.scrollTo(..., { offset: -96 })` to respect the detached floating glass navigation pill.

### Hero canvas sequence

`Hero.tsx` registers GSAP and `ScrollTrigger` in the browser effect. It does not render a `<video>`; the hero is a `h-screen w-screen` section containing a fullscreen canvas with `will-change: transform` / `transform-gpu`. `FRAME_COUNT` is 202 and `frameUrl(index)` resolves `frame-000.webp` through `frame-201.webp`. The first available image is decoded first so the scene can initialize without a percentage loader; 10 asynchronous workers then preload all remaining frames into memory. Canvas data attributes (`data-frame-count`, `data-loaded-frames`, `data-current-frame`, `data-target-frame`, `data-preload-complete`) make the state directly QA-verifiable. A hidden inline SVG in the same component defines `#speedex-ultimate-4k` (`feConvolveMatrix` `0 -1 0 -1 5 -1 0 -1 0` plus the supplied RGB transfer slopes); `.hero-canvas-sharp` applies it only to this canvas with `contrast(1.12) saturate(1.08)`, `-webkit-optimize-contrast` and `crisp-edges`. A colour-only filter declaration precedes the SVG form as a browser fallback.

A plain `{ frame }` proxy is tweened from 0 to 201 by GSAP with the pinned trigger: `start: "top top"`, `end: "+=3000"`, `scrub: true`, `pin: true`, `pinSpacing: true`, `anticipatePin: 1` and `invalidateOnRefresh: true`. Its `onUpdate` rounds and clamps the target index, then schedules at most one draw per animation frame. Drawing cover-crops the 1024×576 image to the canvas bitmap and caps DPR at 2. If the exact frame has not loaded, the nearest loaded frame is drawn instead, so the canvas never intentionally blanks. No React state changes during scroll. While ScrollTrigger is active, `html[data-hero-film="active"]` sets the detached floating header to `visibility: hidden; opacity: 0`, keeping the film completely unobstructed; after the range the canvas unpins into the marquee and `#gateway`.

Under `prefers-reduced-motion`, the pin/scrub tween is not created; a mid-sequence frame is drawn as a still opening. The supplied source is 1024×576, and neither canvas nor WebP conversion can synthesize detail beyond that on a large fullscreen display.

### Gateway and consultancy overview

`Hero.tsx` continues into `#gateway`, the first visible SPEEDEX statement after the cinematic pin. It carries the formal mission “Your trusted commercial gateway between Qatar and China” (AR: “بوابتك التجارية الموثوقة بين قطر والصين”), the operating promise, consultation/corporate-setup CTAs, the Qatar ↔ China bidirectional scope, Air · Sea · Land modes and the trilingual operating fact.

`ConsultancyOverview.tsx` follows with `#about` (three operating pillars: origin assurance, corridor logistics, and market establishment) and `#consultancy`. The five disciplines — Bilateral Sourcing & Logistics, Government Setup, Brand Creation, Office & Store Setup, Full Marketing & Operations — are staggered asymmetric `.swiss-node` glass shards/rows (`data-editorial-service`) with oversized outlined indices, capability traces, signal bars, GSAP-built data meters and pointer-tracked glare, followed by a clipped glass executive-action ribbon. Hover/focus feedback animates only transform, opacity and colours, is gated to fine pointers, and is disabled under reduced motion. Former service-cell CSS and markup have been removed.

### Strategic sections and architectural copy

`StrategicSections.tsx` adds four concise, fully localized chapters around the detailed films: `#why-choose-us` (reliability, 24/7 mediation, transparency and A–Z execution), `#china-gateway` (industrial sourcing, QC, consolidation/documentation and bilateral delivery), `#why-qatar` (Gulf access, Hamad air/sea infrastructure, business platforms and purchasing power), and `#company-setup-services`. The first three each use four staggered polygon-clipped glass nodes (`[data-strategy-node]`) in distinct asymmetric 12-column layouts (`[data-editorial-layout]`), with large outlined indices, animated meter traces, `[data-count]` numeric readouts, pointer glare and a centre rule. China Gateway adds a clipped glass corridor axis for the bidirectional Qatar ↔ China route. Company Setup Services uses four asymmetric clipped-glass annotation slots (`[data-company-setup-placeholder]`) whose specific service copy is intentionally blank for client input. Former strategy-cell/card systems have been removed.

Global `h1`–`h4` elements use uppercase/balanced architectural styling with tight tracking. The typographic system is **Syne** for Latin display/wordmark, **Cairo** for Arabic, **Inter** for Latin body copy and Noto Sans/Serif SC for Chinese support; narrow strategy/Why shards have separate Syne size guardrails so long display words are not clipped or split. `Experience.tsx` staggers sibling reveals, scrubs `[data-meter-fill]`, drifts oversized section numerals and slowly rotates `[data-orbit]` rings. It also animates each `[data-count]` readout once through a plain GSAP proxy — covering the four gateway telemetry counters and strategic-node meters — while reduced-motion renders final values immediately. On `(hover: hover) and (pointer: fine)` devices only, Swiss nodes receive pointer-tracked glare through `--pointer-x` / `--pointer-y`, and non-form glass/platform modules receive `rotationX`/`rotationY` tilt in CSS perspective; both reset on pointer leave and listeners are removed during effect cleanup. Motion remains transform/opacity-only and is disabled under reduced motion.

### Bilateral copy system and Insights

All website-controlled copy is standardized around **Qatar ↔ China**: EN “between Qatar and China”, AR “بين قطر والصين”, ZH “卡塔尔与中国之间”. Metadata, navigation, hero/gateway, trade captions, planner, RFQ, footer, alt text and visible photo credits use formal corporate-advisory terminology and national industrial/commercial-hub scope. Casual hooks, one-way positioning and capital-pair labels have been removed. The client-supplied hero frame artwork itself is unchanged and contains baked artwork in its final frames; replacing those pixels would be a separate asset-editing decision.

`components/Insights.tsx` renders `#insights` after Corporate Setup and before Why SPEEDEX. It contains one featured analysis plus three analytical briefings, localized in EN/AR/ZH: supplier qualification/manufacturing intelligence, Qatar import regulation, Qatar–China air–sea logistics optimization, and cross-border commercial mediation. The section is linked from the primary navigation and uses the architectural heading/subhead system, editorial borders and data markers (`data-insights-section`, `data-insight-article`).

### Trade film

`TradeJourney.tsx` uses a 340–380svh wrapper with a CSS-sticky 100svh stage. CSS sticky was chosen instead of GSAP pinning because it remains stable with Smooth, RTL and mobile browser chrome.

- Scroll progress maps the China industrial-network layer from 88% to 12% visibility. Visible captions and route graphics use national Qatar/China hub labels (`QAT ↔ CHN`), not a capital-city pair, airport codes, coordinates or a fixed capital distance.
- A gold seam and circular handle track the split.
- The four service phases change at quartiles of the journey.
- Both photographs counter-parallax and scale subtly.
- Pointer drag and keyboard arrows temporarily override scroll; a meaningful new scroll delta resumes scroll control.
- In RTL the physical clip and pointer math mirror, so the China layer begins on the inline-start (right) side.

### Blueprint → Reality

Before the sticky film, the client-requested setup board is rendered as native responsive content rather than an embedded screenshot. It pairs a sharp clipped Blueprint/Reality architectural stage (the real Qatar corporate-skyline photograph revealed from the ground up over the SVG blueprint) with an open five-stage checklist on a glass control ribbon and three staggered MOCI/QFC/QFZ platform ribbons. All required board content and behaviour are retained. The board has an independent `boardBuild` state: an `IntersectionObserver` auto-plays it once when visible (or sets 100 under reduced motion), while its range slider and replay button provide direct control without being overwritten by the fullscreen film below.

`CorporateSetup.tsx` then uses the same sticky technique over 340–370svh for the immersive construction film.

- Scroll progress maps to `build: 0–100`.
- The real daytime Qatar corporate-skyline photograph starts desaturated/dark and gains colour/brightness.
- A blueprint-grid/SVG skyline overlay is clipped away from the bottom upward.
- A gold scanline follows the construction frontier.
- The setup board above is the single stage checklist; its five stages activate at 6/28/52/76/96%. The fullscreen film deliberately contains no duplicated floating stage list, aside or active-stage copy — only the image, percentage, scanline and bottom precision control.
- The range input and replay button provide manual override; subsequent scroll movement returns control to the timeline.

## 4. Opening sequence

There is deliberately **no preloader UI**. The former dot-matrix globe/percentage Three.js intro, its component, replay controls, scroll lock and dependencies have been removed. The first meaningful paint is the canvas sequence itself. Frame loading happens asynchronously behind that first decoded frame, with a nearest-loaded fallback rather than a visible progress/percentage screen.

## 5. Internationalisation and direction

`lib/i18n.ts` is currently a complete typed dictionary for English, Arabic and Chinese. `Experience.tsx` sets:

- `document.documentElement.lang` (`en`, `ar`, or `zh-CN`)
- `document.documentElement.dir` (`ltr` or `rtl`)
- Tailwind logical utilities and CSS logical properties throughout

Arabic-specific protections include reduced kicker letter-spacing, mirrored clips/pointer calculations, reversed marquee direction and layout mirroring in navigation and forms.

Phase-2 SEO option: move the dictionary into locale route segments (`/en`, `/ar`, `/zh`) with `next-intl` if separate indexable URLs and hreflang output become a launch requirement. The present build deliberately keeps one canonical cinematic route and instant in-page language switching.

## 6. Theme system

Themes are controlled by `data-theme="dark|light"` on `<html>`. A tiny inline script in `app/layout.tsx` applies the stored preference before first paint to avoid a flash.

- Dark: `#070709` core field, `#140A0F` maroon-tinted field, luxury burgundy `#6B1D2F`, champagne gold `#C5A059`, ivory type
- Light: warm ivory paper, deep maroon ink
- Photo chapters remain dark in both modes for photographic continuity
- Header/footer/manifesto/editorial reading surfaces follow the selected theme; the only Day/Night toggle is footer-hosted as `[data-footer-theme-control]`, keeping the header composition clean

## 7. Vector brand system

The old 3D raster mark could not be traced naïvely: its extrusion merged into a blobby silhouette. The final process was:

1. Isolate the bright planar front face from the supplied transparent logo extraction with a luminance mask.
2. Remove fragments and smooth the mask at high resolution.
3. Simplify the contour and convert it to hand-smoothed Bézier curves.
4. Redraw the globe geometrically with ellipses, latitude paths and a clip path.
5. Render as an inline React SVG using `currentColor`.

Outputs:

- `components/SpeedexMark.tsx` — theme-aware header mark
- `public/assets/speedex-mark.svg` — maroon standalone/favicon source
- `public/assets/speedex-mark-white.svg` — white standalone

The wordmark is live **Syne** typography, not an image. No other logo image is used on the page; the footer repeats only the SPEEDEX name in text and hosts the sole Day/Night theme control. In `Nav.tsx`, the crisp vector is presented as a four-layer pseudo-3D maroon emblem: deep extrusion, `#6B1D2F` mid-depth, theme-aware front face and a restrained highlight, transformed in CSS perspective. The outer `[data-clean-header]` is pointer-transparent except for its detached `[data-floating-nav]` pill and floating mobile panel. The pill contains the logo, six unnumbered links, the EN/عربي/中文 switcher and one mandate CTA; it uses a 999px radius with backdrop blur/saturation and stays hidden while the hero film is active. The primary links are `#trade`, `#planner`, `#setup`, `#china-gateway`, `#why-qatar` and `#insights` (the China navigation label is shortened to “China Gateway” / “بوابة الصين” / “中国门户”, while the section title remains “China Gateway & Why China”). The executive CTA uses localized `nav_cta` copy (`Initiate Mandate` / `طلب تفويض مؤسسي` / `发起企业委托`) with `bg-[#6B1D2F] text-white rounded-full px-5 py-2` plus `.btn-executive`; browser QA computes `background-color: rgb(107, 29, 47)`, white text, a 999px radius and zero header theme toggles.

## 8. Interactive business logic

### Bidirectional Logistics Planner

`Planner.tsx` exposes an explicit trade-direction control (`cn-qa` / `qa-cn`) with localized labels. China → Qatar uses Ningbo, Shanghai, Guangzhou, Shenzhen and Yiwu origins; Qatar → China uses Hamad Port, Hamad International Airport, Mesaieed Industrial City and Ras Laffan Industrial City. The destination output is expressed as national commercial/industrial hubs rather than one destination city. Current indicative rules:

- Sea: `max(CBM, 1) × origin rate + 650`
- Origin sea rates: Ningbo 385, Shanghai 390, Guangzhou 365, Shenzhen 365, Yiwu 405; Hamad Port 410, Hamad International Airport 425, Mesaieed 415, Ras Laffan 430
- Air chargeable weight: `max(kg, round(CBM × 167))`
- Air: `chargeable × 4.9 + 380`
- Display band: −15% / +20%
- Equipment: LCL ≤10 CBM; 20ft ≤28; 40ft ≤58; otherwise 40HQ/multiple

The controls and results sit on offset `.glass-ribbon-dark` sheets so white type retains contrast over the photographic chapter in both themes. Load bars have fixed layout heights and use baseline `scaleY` transforms when active. `[data-container-simulator]` mirrors the selected volume as a 12-cell, transform-scaled gradient fill with a live percentage, RTL-aware transform origin and `40HQ envelope` (sea) / `ULD envelope` (air) labelling. These values must be replaced by an approved SPEEDEX rate card for both directions before commercial launch.

### RFQ

The RFQ is a client-side reference generator with formats:

- `SPX-2026-####-TRD`
- `SPX-2026-####-SET`
- `SPX-2026-####-ALL`

Recommended production endpoint contract: `POST /api/rfq` → schema validation → CRM/email/WhatsApp notification → return the same reference format so the existing UI state can remain unchanged.

## 9. Responsive strategy

Latest emergency anti-template verification viewports:

- 1440 × 1000 desktop (English, dark and light themes)
- 390 × 844 mobile (Arabic RTL)
- Canonical port 3000 and refreshed static port 4174 both pass the same 27-check Puppeteer suite with `ERRORS []`: unobstructed 202-frame forward/reverse hero scrub, exact clean-header composition, computed Syne/Cairo/Inter typography, polygon-clipped blurred gradient glass surfaces, pointer glare, telemetry `2/3/5/24`, first China node `94`, live container-fill transform, `matrix3d` glass tilt/reset, footer-only theme cycling, setup board and Arabic RTL mobile menu; evidence: `/home/user/SPEEDEX-Emergency-AntiTemplate-Overhaul-QA.jpg`

Sticky scenes use `svh`; type uses `clamp()`; captions have separate mobile widths; the fullscreen corporate film remains clean and list-free at every breakpoint; forms and editorial rows stack without horizontal overflow. Desktop interaction QA also checks `documentElement.scrollWidth <= innerWidth` at hero, trade, planner, corporate and RFQ positions.

## 10. Security and dependency posture

- Next is pinned to the patched 15.5.28 backport.
- An npm override pins PostCSS to 8.5.31 because Next’s bundled transitive version lagged current advisories at handover.
- `npm audit` reported zero known vulnerabilities after the final install.
- No secrets, API keys or server actions are present in this front-end build.

## 11. Launch checklist

- [ ] Set production domain and `metadataBase`
- [ ] Connect RFQ backend and test deliverability
- [ ] Replace planner demo rates and approve wording
- [ ] Obtain legal review of MOCI/QFC/QFZ claims, timelines and fees
- [ ] Add official contact details, WhatsApp number, address and CR details if desired
- [ ] Confirm photographic and architectural-work rights for Qatar commercial use
- [ ] Decide whether locale-specific URLs/hreflang are required for SEO
- [ ] Add analytics/consent according to launch markets
