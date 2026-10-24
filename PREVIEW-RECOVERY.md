# SPEEDEX preview recovery — Next.js v2 canvas + emergency anti-template overhaul

_Last verified: 24 October 2026. Canonical production build: 94.7 kB route / 197 kB first-load JS; production audit: 0 vulnerabilities._

If Arena shows “Local preview unavailable” or a 404 after a workspace restore, the source files are normally safe; running processes, `node_modules` and `.next` are not guaranteed to survive a snapshot restore.

## Correct project

- **Live source:** `/home/user/speedex/` — Next.js App Router
- **Static fallback export:** `/home/user/SPEEDEX-STATIC-PREVIEW/`
- **Static server:** `/home/user/serve-speedex-static.cjs`
- **Hero frames:** `/home/user/speedex/public/assets/frames/frame-000.webp` … `frame-201.webp` (202 files)
- **Legacy backup only:** `/home/user/speedex-legacy-vite/`
- The former MP4/poster are archived at `/home/user/SPEEDEX-ARCHIVED-VIDEO/` and are not used by the site.

## Restore the static fallback immediately

Run this as a long-lived process:

```bash
node /home/user/serve-speedex-static.cjs
```

It listens on `0.0.0.0:4174` and serves the refreshed emergency anti-template canvas build from `/home/user/SPEEDEX-STATIC-PREVIEW/` (228 files including 202 WebP frames served as `image/webp`, relative public-asset paths in rendered documents/page bundle, canonical `next.config.mjs` restored and hash-verified after export).

## Restore the canonical production preview

```bash
cd /home/user/speedex
npm ci
npm run build
npm audit --omit=dev --audit-level=high
npm run start
```

The canonical app listens on `0.0.0.0:3000`.

For development:

```bash
cd /home/user/speedex
npm ci
npm run dev
```

## Health checks

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/assets/frames/frame-000.webp
curl -I http://127.0.0.1:3000/assets/frames/frame-100.webp
curl -I http://127.0.0.1:3000/assets/frames/frame-201.webp
curl -I http://127.0.0.1:3000/assets/beijing-cbd-real.jpg
curl -I http://127.0.0.1:3000/assets/doha-west-bay-real.jpg
curl -I http://127.0.0.1:3000/assets/doha-skyline-real.jpg
curl -I http://127.0.0.1:3000/assets/speedex-mark.svg
curl -I http://127.0.0.1:4174/
curl -I http://127.0.0.1:4174/assets/frames/frame-201.webp
```

Every URL above should return `200`. The document title should be `SPEEDEX — Bilateral Trade Between Qatar and China`. In a browser, the opening `<canvas data-hero-canvas>` should reach `data-loaded-frames="202"` and `data-preload-complete="true"`; scrolling through the pinned 3,000px range should map `data-current-frame` from `0` toward `201`, reverse cleanly, then unpin into `#gateway`. Its computed CSS filter should include `url("#speedex-ultimate-4k")`, `contrast(1.12)` and `saturate(1.08)`. During the pinned film the floating header should be hidden (`visibility: hidden`, opacity `0`). After unpinning, `[data-clean-header]` / `[data-floating-nav]` should be a detached 999px glass pill exposing the logo, exactly six unnumbered `[data-nav-link]` destinations (`trade`, `planner`, `setup`, `china-gateway`, `why-qatar`, `insights`), three language buttons (EN/عربي/中文), one four-layer `[data-emblem-3d]`, one burgundy `[data-executive-cta]` (`Initiate Mandate` / `طلب تفويض مؤسسي`) computed as `rgb(107, 29, 47)` with white text, and zero header theme toggles. The sole Day/Night control is footer-hosted as `[data-footer-theme-control]` and must cycle dark → light → dark. Computed Latin headings/wordmark should begin with Syne, Latin body type with Inter, and Arabic headings/body/links with Cairo. Sampled Swiss/glass/platform/editorial/setup surfaces should compute polygon clip-paths, backdrop blur and gradient backgrounds; generic `.service-cell`, `.strategy-cell`, `.card`, `.grid-card` and `.text-box` counts must be zero. The strategic sections `[data-strategic-section]` should include `why-choose-us`, `china-gateway`, `why-qatar` and `company-setup-services`, with 12 `[data-strategy-node]` elements and four `[data-company-setup-placeholder]` slots. In Corporate Setup, `[data-setup-board]` should autoplay to `data-board-build="100"` when scrolled into view, with five checked stages and three `[data-setup-platform-ribbon]` elements. The following fullscreen Blueprint→Reality sticky film must remain clean: its sticky container should contain zero `<aside>` elements, zero ordered stage lists and none of the five board stage titles. `#insights` should contain four `[data-insight-article]` briefings; visible copy must use Qatar ↔ China / formal mandate language with no capital-pair, `6,318 KM`, `PEK`, front-door or casual-hook strings; the planner must expose both `[data-planner-direction="cn-qa"]` and `[data-planner-direction="qa-cn"]`. Gateway telemetry `[data-telemetry]` should settle at `2/3/5/24`, the first China Gateway node counter should reach `94`, and `[data-container-simulator]` should change its transform-scaled fill when CBM changes. Fine-pointer hover should update pointer-glare variables and produce a live `matrix3d` glass tilt that resets on leave. Latest combined evidence: `/home/user/SPEEDEX-Emergency-AntiTemplate-Overhaul-QA.jpg` (27/27 checks on ports 3000 and 4174, `ERRORS []`).

The visible sequence is generated from the root PNGs in `https://github.com/ir44747-stack/speedex` (commit `8f60ad3`) and deployed locally as WebP frames, so normal page operation does not depend on GitHub at runtime.
