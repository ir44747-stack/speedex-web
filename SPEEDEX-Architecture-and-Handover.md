# SPEEDEX — Cinematic Website v2

## Architecture, Creative System & Handover

**Company:** SPEEDEX — Commercial Mediation & Consultancy  
**Primary division:** Bilateral Trade, Sourcing & Supply Chains · Qatar ↔ China  
**Premium complement:** A-to-Z Corporate Setup in Qatar  
**Build:** Next.js App Router · Tailwind CSS · GSAP ScrollTrigger · Smooth  
**Handover date:** 24 October 2026

---

## What changed in v2

The site has been completely rebuilt from the earlier Vite prototype into a real **Next.js** application. The previous boxed-card language has been removed. The new page behaves as one continuous cinematic journey:

```text
Cinematic departure → flight → Qatar arrival → bilateral sourcing and freight
→ market entry → company blueprint → licensed launch → Insights → mandate intake
```

Bilateral trade remains the core narrative. Corporate Setup follows the logistics planner as the formal market-entry complement: *“From commercial movement to corporate presence.”*

The former Vite implementation is preserved at `/home/user/speedex-legacy-vite/` for reference. The live source of truth is now `/home/user/speedex/`.

---

## 1. Creative system

### Brand palette

| Token | Value | Role |
|---|---:|---|
| Luxury burgundy | `#6B1D2F` | Primary identity, CTAs, RFQ field and construction accents |
| Core dark / burgundy field | `#070709` / `#140A0F` | Cinematic dark surfaces |
| Wine highlight | `#C83A5D` | Small live highlights and the logo mark on dark glass, retained for contrast |
| Champagne gold | `#C5A059 → #E5C98C` | Route seam, hairlines, national-hub route labels, premium CTA |
| Warm ivory | `#F5EFE4` | Light surfaces and photographic type |

### Typography

- **Syne** for Latin display headlines, the SPEEDEX wordmark, numbers and route data
- **Cairo** for Arabic display and body typography
- **Inter** for Latin body copy
- **Noto Sans SC / Noto Serif SC** for Chinese support

Arabic display copy avoids inappropriate tracking and uses Cairo with RTL-safe line-height rather than forcing a Latin display treatment.

### Anti-template rule

The emergency redesign deliberately eliminates flat black cards, basic text containers, random tiles and generic grids:

- Photography is full-bleed or split across the viewport.
- Consultancy, strategic and Insights content uses asymmetric editorial composition and floating polygon-clipped glass: staggered 12-column placement, oversized outlined indices, hairline rules, layered maroon-obsidian gradients, backdrop blur, internal highlights, data meters and pointer glare. Former service/strategy cell classes and generic card/text-box hooks are absent in browser QA.
- Checkpoints sit on one continuous route line.
- Planner answers are oversized figures across hairline rows on offset dark-glass sheets.
- Corporate stages live once in the interactive setup board; MOCI/QFC/QFZ are staggered platform ribbons and the following full-screen photograph remains clean and list-free.
- The RFQ is a maroon room with underline-only fields on a dark clipped glass layer.
- The footer is typographic and minimal, and it hosts the only Day/Night theme control so the top bar remains exact and uncluttered.

Buttons remain pill-shaped only where a clear action needs a tactile target.

---

## 2. The new SPEEDEX vector mark

The supplied logo render could not simply be traced: the 3D extrusion caused the gazelle, horns and globe to collapse into a rough blob. The final header mark was rebuilt as follows:

1. The bright planar front face of the supplied transparent logo extraction was isolated with a luminance mask.
2. Noise/fragments were removed and the silhouette was smoothed at high resolution.
3. The contour was simplified into clean Bézier curves, preserving the head, ear, swept horns, leap and legs.
4. The wireframe globe was redrawn geometrically rather than traced.
5. The result was implemented as an inline `currentColor` SVG React component.

Files:

- `speedex/components/SpeedexMark.tsx`
- `speedex/public/assets/speedex-mark.svg`
- `speedex/public/assets/speedex-mark-white.svg`
- `speedex/public/favicon.svg`

The mark has a transparent background and no bounding box. In the header, four aligned copies of the same crisp vector create a pseudo-3D maroon emblem: deep extrusion, `#6B1D2F` mid-layer, theme-aware front face and a restrained highlight, all held in CSS perspective and animated only by transform. The Syne wordmark and emblem appear inside a detached clean floating glass pill containing only six unnumbered primary links — Trade Corridor, Logistics Planner, Corporate Setup, China Gateway, Why Qatar and Insights & Editorial — the EN/عربي/中文 switcher and one localized **Initiate Mandate** (`طلب تفويض مؤسسي`) burgundy capsule. The header contains no Day/Night toggle. The navigation label is shortened to “China Gateway”; the corresponding section heading retains “China Gateway & Why China”.

---

## 3. Page choreography

### 3.1 Immediate opening

- No preloader: the dot-matrix globe, percentage counter, skip/replay controls, scroll lock and Three.js dependency have been completely removed
- The page starts directly with a fullscreen HTML5 canvas image sequence; there is no hero video element, poster or loading percentage
- The detached floating glass header is `visibility: hidden; opacity: 0` while the canvas sequence is pinned, then returns as it unpins

### 3.2 Hero — canvas frame sequence

- Full-screen HTML5 `<canvas>`, not a `<video>`: `Hero.tsx` draws one frame from a 202-image sequence sourced from `https://github.com/ir44747-stack/speedex` (commit `8f60ad3`). The repository's PNGs live at its root and total about 89.22 MiB; the site deploys 1024×576 WebP derivatives (quality 84) totalling 7.91 MiB in `public/assets/frames/`
- The first available frame initializes the pinned scene; 10 asynchronous workers then preload every remaining frame into memory. A nearest-loaded-frame fallback prevents blank draws during the earliest scroll
- GSAP/ScrollTrigger drives a lightweight `{ frame }` proxy from 0 to 201 with `start: "top top"`, `end: "+=3000"`, **`scrub: true`**, `pin: true` and `pinSpacing: true`; scrolling down advances the supplied departure/flight/arrival sequence, scrolling up reverses it exactly. Draw calls are coalesced through `requestAnimationFrame`, with no React state per frame
- The canvas is `h-screen w-screen`, cover-cropped and GPU-layer hinted (`will-change: transform` / `transform-gpu`); device-pixel ratio is capped at 2. The hidden inline `#speedex-ultimate-4k` SVG convolution/colour filter is applied only through `.hero-canvas-sharp`, with `contrast(1.12) saturate(1.08)` and crisp-edge rendering. It raises perceived edge acutance, but native source frames remain 1024×576, so true detail and fullscreen sharpness are still bounded by that source
- **Pure cinema only:** no visible hero title, subtitle, CTA, coordinates, progress hairline or header sits over the pinned sequence (a visually hidden H1 is retained for semantics/SEO)
- At the final frame, the hero unpins seamlessly into the service marquee and the visible SPEEDEX gateway. The former MP4/poster remain archived at `/home/user/SPEEDEX-ARCHIVED-VIDEO/` and are not part of the production request path

### 3.3 Gateway, Who We Are and services

- `#gateway` states the formal central mission: “Your trusted commercial gateway between Qatar and China.” Arabic: “بوابتك التجارية الموثوقة بين قطر والصين”. Animated telemetry beneath it settles at 2 nations, 3 operating languages, 5 integrated disciplines and 24/7 mediation coverage.
- `#about` explains the accountable bridge through three pillars: origin assurance, corridor logistics, and market establishment
- `#consultancy` presents five A-to-Z disciplines as staggered editorial nodes with signal bars: Bilateral Sourcing & Logistics, Government Setup, Brand Creation, Office & Store Setup, and Full Marketing & Operations, followed by a glass executive-action ribbon
- `#why-choose-us` states the operating standard in four asymmetric nodes: reliability, 24/7 mediation, transparency and A–Z execution
- `#china-gateway` introduces the supply system before the detailed film with a glass bidirectional corridor axis and four reversed-flow nodes: industrial sourcing, quality control, consolidation/documentation and bilateral delivery

### 3.4 Section 01 — The Core: Bilateral Trade & Supply Chains

A 340–380svh sticky film:

- The China industrial-network layer begins dominant and physically gives way to the Qatar commercial-network layer as the visitor scrolls
- Gold seam can be dragged or controlled by keyboard
- Captions use national hub-network labels and `QAT ↔ CHN`; capital coordinates, airport codes and fixed capital distance have been removed
- Four narrative phases crossfade in the lower band:
  1. Sourcing & Negotiation
  2. Verification & Quality Assurance
  3. Consolidation & Freight
  4. Customs & Distribution
- Counter-parallax makes the two skylines feel dimensional rather than pasted together

After the film, services become a numbered editorial index and the shipment process becomes a single checkpoint line.

### 3.5 Bidirectional Logistics Planning Model

A full-bleed maroon chapter with Qatar skyline photography under the grade:

- Sea/Air underline tabs
- Explicit China → Qatar / Qatar → China direction control; five China industrial origins or four Qatar logistics/industrial origins
- CBM and weight precision sliders
- Container/chargeable-load meter
- Oversized destination-market, transit, indicative range, equipment and chargeable-weight outputs

The economics are retained demonstration rules and are labelled indicative in all languages.

### 3.6 Why Qatar and Company Setup Services

- `#why-qatar` frames the destination case in four data-led editorial nodes: Gulf gateway, Hamad air/sea infrastructure, Mainland/QFC/free-zone platforms and purchasing power
- `#company-setup-services` provides the structured corporate-formation overview. Four open blueprint annotation slots, defined only by dashed hairlines and diamond markers, are intentionally left blank for client-defined input; the detailed formation journey follows in the setup board and construction film

### 3.7 Arrival interlude

A typographic breath marks the change of division:

> “From commercial movement to corporate presence.”

### 3.8 Section 02 — Corporate Setup A-to-Z

The client-supplied setup-board design is now implemented natively at the head of this section: a sharp clipped Blueprint/Reality architectural stage using the real Qatar corporate-skyline photograph, an open five-stage checklist on a glass control ribbon with construction slider and replay button, a live percentage, and three staggered MOCI/QFC/QFZ platform ribbons. The supplied board content and controls are unchanged in function. It auto-plays once when it enters the viewport, mirrors correctly in Arabic RTL, stacks on mobile, and keeps its own `boardBuild` state independent from the film below.

Another full-screen sticky construction film follows:

- Real daytime Qatar corporate-skyline photograph begins desaturated under a blueprint grid
- SVG towers and window lights sit over the photograph
- A gold scanline reveals full-colour “reality” from the ground up
- Stages activate at 6/28/52/76/96%
- No duplicated floating stage rail or mobile active-stage copy is rendered over the fullscreen film; the setup board above is the only five-stage checklist
- The construction can be scroll-driven, dragged with the precision range, or replayed

MOCI, QFC and QFZ then appear as an editorial platform index—not pricing cards.

### 3.9 Insights & Commercial Analysis

`#insights` sits after Corporate Setup and before Why SPEEDEX, linked from the primary navigation. It is an authoritative editorial section — not a generic news feed — with one featured analysis and three analytical briefings:

1. **Manufacturing Intelligence:** supplier qualification in China, with evidence before financial commitment.
2. **Import Regulation:** Qatar import readiness across classification, documentation and clearance discipline.
3. **Logistics Optimization:** air–sea allocation across the Qatar–China corridor.
4. **Commercial Mediation:** aligning factories, buyers and service providers across Qatar and China.

The section is localized in English, Arabic RTL and Chinese and follows the architectural heading system as an asymmetric magazine flow: a clipped glass featured analysis followed by three staggered open briefing nodes with meter traces.

### 3.10 Why, RFQ and footer

- Why SPEEDEX places three principles across a full-bleed Qatar commercial-skyline night photograph
- RFQ fields are transparent, single-underline controls on maroon
- Service choice uses accessible radio inputs with custom gold markers
- Successful submission produces an immediate SPEEDEX reference
- Footer contains the text wordmark, formal positioning line, bidirectional Qatar ↔ China rights statement, photography credit and the sole footer-hosted Day/Night theme control

---

## 4. Technical architecture

```text
speedex/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Experience.tsx
│   ├── Nav.tsx
│   ├── SpeedexMark.tsx
│   ├── Hero.tsx
│   ├── ConsultancyOverview.tsx
│   ├── TradeJourney.tsx
│   ├── DayNightToggle.tsx
│   ├── StrategicSections.tsx
│   ├── Planner.tsx
│   ├── CorporateSetup.tsx
│   ├── Insights.tsx
│   └── Closing.tsx
├── lib/
│   └── i18n.ts
├── public/
│   ├── assets/          202 canvas frames, real photography + standalone SVG marks
│   └── favicon.svg
├── ARCHITECTURE.md
├── IMAGE-CREDITS.md
├── README.md
├── next.config.mjs
├── package.json
├── package-lock.json
└── tsconfig.json
```

### Installed platform

- Next.js **15.5.28** (patched backport)
- React **19.1.1**
- Tailwind CSS **4**
- GSAP **3.15** at lockfile generation
- Smooth **1.3.27** at lockfile generation
- PostCSS override **8.5.31**

`npm audit` completed with **zero known vulnerabilities** for the final dependency tree.

### Motion model

- Smooth handles wheel/touch glide on the native scrollbar
- GSAP ticker drives Smooth; ScrollTrigger updates from Smooth scroll events
- Large scenes use CSS sticky rather than GSAP pinning for reliability with RTL and mobile dynamic viewports
- GSAP handles the pinned canvas frame-index scrub, staggered sibling reveals, image parallax, trade split progress, construction progress, counters, meter fills, pointer glare and glass tilt; canvas drawing is rAF-coalesced and uses no React state per frame
- `prefers-reduced-motion` disables Smooth and the hero pin/scrub sequence and avoids hidden-content animation states

### Language and theme model

- One typed dictionary powers English, Arabic and Chinese
- Arabic sets true document RTL; clips, handle math, menus and forms mirror logically. All three locales use formal corporate-advisory copy standardized on Qatar ↔ China and national industrial/commercial hubs
- Dark/light preference is applied before paint by a small theme script; its visible Day/Night control is intentionally footer-only (`[data-footer-theme-control]`)
- Photo chapters remain dark by art direction while reading surfaces respond to theme

---

## 5. Verified QA

Production build:

- `npm run build` passes strict TypeScript and static generation
- `/` prerenders statically
- First-load JS reported by Next: **197 kB** (route 94.7 kB)
- All sampled hero frames (`000`, `100`, `201`), three photographs and the SVG mark return HTTP 200

Headless Chrome visual/interaction QA covered:

| Viewport / state | Result |
|---|---|
| 1440 × 900 desktop, English dark | Hero, trade film, planner, blueprint, why, RFQ pass |
| 1180 × 820 iPad landscape | Layout and sticky scenes pass |
| 820 × 1180 tablet, Chinese | Hero, trade, blueprint, why and RFQ pass |
| 390 × 844 mobile, Arabic RTL + light | Header/menu, hero, trade, blueprint, why and RFQ pass |
| Desktop interactions | Arabic RTL switch, trade drag, planner recalculation, corporate slider/replay, RFQ reference and theme toggle pass |
| Horizontal overflow | No overflow at tested desktop scroll positions |
| Browser errors | No page errors in the interaction run |
| Canvas sequence, desktop/mobile | All 202 frames preload; scroll maps 0 → 50 → 101 → 201, reverses to 50, pins cleanly and unpins into `#gateway`; no video element, no horizontal overflow and `ERRORS []` on canonical and static previews |
| Strategic sections | Why Choose Us, China Gateway, Why Qatar and Company Setup Services render in EN/AR/ZH, in the intended layout order, with 12 staggered `[data-strategy-node]` elements, four blank setup placeholders, architectural heading metrics, no node overlaps and no mobile overflow |
| Bilateral copy + Insights | Canonical port 3000 and static port 4174 pass the copy-overhaul suite: formal EN/AR/ZH mission and RFQ copy, no visible capital-pair/distance/casual strings, both planner directions, four localized Insights briefings, 202 hero frames, mobile Arabic RTL, no overflow and `ERRORS []`; evidence: `/home/user/SPEEDEX-Bilateral-Copy-Insights-QA.jpg` |
| Swiss editorial / 3D UI overhaul | The dedicated 19-check Puppeteer suite passes on both ports: six visible executive links, four-layer 3D emblem matrix, `#6B1D2F` mandate capsule, zero `.service-cell`/`.strategy-cell`, 202/202 hero frames with frame 0→114→0 scrub, setup slider at 89 with a list-free sticky film, Arabic RTL mobile menu, light-theme planner contrast, zero overlaps/overflow and `ERRORS []`; evidence: `/home/user/SPEEDEX-Swiss-Editorial-Overhaul-QA.jpg` |
| Critical dynamic overhaul | The preceding 21-check Puppeteer suite passes on canonical port 3000 and refreshed static port 4174 with `ERRORS []`: 202/202 frames scrub `0 → 114 → 0` with the floating header hidden during the film; detached 999px glass pill (desktop top 16px/mobile 12px, backdrop blur 22px); six exact links; CTA computed as `rgb(107, 29, 47)` with white text; telemetry `2/3/5/24`; first China node `94/100`; container fill `scaleX 0.176 → 0.941` at 64 CBM; live `matrix3d` glass tilt/reset; zero desktop/mobile overflow. Evidence: `/home/user/SPEEDEX-Critical-Dynamic-Overhaul-QA.jpg` |
| Emergency anti-template overhaul | The final 27-check Puppeteer suite passes on canonical port 3000 and refreshed static port 4174 with `ERRORS []`: 202/202 frames with forward/reverse scrub and the header hidden during the film; exact clean header (logo, six unnumbered links, three language controls, one mandate CTA, zero header theme toggles); computed Syne/Cairo/Inter typography; polygon-clipped blurred maroon-obsidian glass; 33 pointer-glare and 18 tilt-ready modules; telemetry `2/3/5/24`; first China node `94/100`; container fill `scaleX 0.176 → 0.928`; footer-only Day/Night cycling; zero desktop/mobile overflow. Evidence: `/home/user/SPEEDEX-Emergency-AntiTemplate-Overhaul-QA.jpg` |

Fixes discovered through screenshots and incorporated:

- Desktop hamburger no longer leaks into the xl header
- The China side of the trade film was brightened so both national layers remain photographically present
- Mobile RTL China/Qatar captions were separated and lifted clear of the phase band
- Why/RFQ photographic text contrast was increased
- The duplicated fullscreen stage rail was removed; desktop/mobile Arabic RTL QA at 89% confirms zero sticky-film asides or stage lists while the setup board retains five stages
- The first Swiss-layout pass exposed one China-node overlap and a crowded gateway stat band; both were corrected and retested to zero overlaps. The orbital decoration was also reduced from a solid conic disc to a thin maroon/gold ring
- The critical dynamic pass detached the header into a floating pill, corrected the CTA background cascade so `#6B1D2F` survives the executive gradient, and browser-verified counters, pointer tilt and the live container/ULD fill simulator
- The emergency anti-template pass moved the Day/Night control out of the header into the footer, retuned narrow Syne headings so `ACCOUNTABLE` and `DOCUMENTARY` render complete, and re-verified the asymmetric glass/glare system on both final builds

---

## 6. What still needs business input before launch

1. **RFQ endpoint:** connect the form to CRM, email and/or WhatsApp Business. The current reference is generated locally.
2. **Planner rate card:** replace demonstration rates, bands, minimums and equipment rules with approved SPEEDEX economics.
3. **Legal review:** confirm MOCI/QFC/QFZ activity claims, timelines, fees and any statements requiring qualification.
4. **Official contact layer:** add the final WhatsApp number, email, Qatar/China office addresses, CR details and social profiles if desired.
5. **Domain/SEO:** set the final canonical domain; decide whether separate `/en`, `/ar`, `/zh` indexable routes are needed.
6. **Image rights:** review Qatar architectural/freedom-of-panorama exposure before paid commercial campaigns. Provenance and the specific Commons warning are recorded in `IMAGE-CREDITS.md`.
7. **Analytics and consent:** select the approved stack for Qatar/China audiences.

---

## 7. Runbook

```bash
cd /home/user/speedex
npm ci
npm run build
npm audit --omit=dev --audit-level=high
npm run start
```

Production preview: http://localhost:3000

Refreshed static fallback:

```bash
node /home/user/serve-speedex-static.cjs
# http://localhost:4174 — serves /home/user/SPEEDEX-STATIC-PREVIEW/
```

Development:

```bash
npm run dev
```

The legacy Vite version remains untouched in `/home/user/speedex-legacy-vite/` if a rollback reference is ever needed.
