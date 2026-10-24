'use client'

import { useCallback, useEffect, useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dict, type Lang } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

/*
 * Frame source: https://github.com/ir44747-stack/speedex (main @ 8f60ad3).
 * The repository contains 202 PNG frames at its root, 1024×576, totalling
 * 89.22MiB. They were pulled from that repository and converted without
 * resizing to quality-84 WebP (7.91MiB total) under /assets/frames so the
 * browser can preload the complete sequence without a 89MB opening payload.
 */
const FRAME_COUNT = 202
const FRAME_WIDTH = 1024
const FRAME_HEIGHT = 576
const frameUrl = (index: number) => `/assets/frames/frame-${String(index).padStart(3, '0')}.webp`

export default function Hero({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const setFilmActive = useCallback((active: boolean) => {
    if (active) document.documentElement.dataset.heroFilm = 'active'
    else delete document.documentElement.dataset.heroFilm
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) {
      setFilmActive(false)
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setFilmActive(!reducedMotion)

    let disposed = false
    let firstFrameReady = false
    let loadedCount = 0
    let currentFrame = -1
    let targetFrame = reducedMotion ? Math.floor((FRAME_COUNT - 1) / 2) : 0
    let drawQueued = false
    let rafId = 0
    let gsapContext: gsap.Context | undefined

    const images: HTMLImageElement[] = Array.from({ length: FRAME_COUNT }, () => new Image())
    const loaded: boolean[] = Array.from({ length: FRAME_COUNT }, () => false)

    canvas.dataset.frameCount = String(FRAME_COUNT)
    canvas.dataset.loadedFrames = '0'
    canvas.dataset.currentFrame = '0'
    canvas.dataset.targetFrame = String(targetFrame)
    canvas.dataset.preloadComplete = 'false'

    const findLoadedFrame = (requested: number) => {
      if (loaded[requested]) return requested
      for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
        const before = requested - offset
        if (before >= 0 && loaded[before]) return before
        const after = requested + offset
        if (after < FRAME_COUNT && loaded[after]) return after
      }
      return -1
    }

    const drawFrame = (requestedFrame: number) => {
      const requested = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(requestedFrame)))
      const actual = findLoadedFrame(requested)
      canvas.dataset.targetFrame = String(requested)
      if (actual < 0 || canvas.width === 0 || canvas.height === 0) return

      const image = images[actual]
      const imageWidth = image.naturalWidth || FRAME_WIDTH
      const imageHeight = image.naturalHeight || FRAME_HEIGHT
      const scale = Math.max(canvas.width / imageWidth, canvas.height / imageHeight)
      const drawWidth = Math.ceil(imageWidth * scale)
      const drawHeight = Math.ceil(imageHeight * scale)
      const drawX = Math.round((canvas.width - drawWidth) / 2)
      const drawY = Math.round((canvas.height - drawHeight) / 2)

      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'
      context.fillStyle = '#070709'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight)

      currentFrame = actual
      canvas.dataset.currentFrame = String(actual)
    }

    const queueDraw = (frame: number) => {
      targetFrame = frame
      if (drawQueued) return
      drawQueued = true
      rafId = window.requestAnimationFrame(() => {
        drawQueued = false
        if (!disposed) drawFrame(targetFrame)
      })
    }

    const resizeCanvas = () => {
      const width = Math.max(1, Math.round(section.clientWidth || window.innerWidth))
      const height = Math.max(1, Math.round(section.clientHeight || window.innerHeight))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.round(width * dpr)
      const nextHeight = Math.round(height * dpr)
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
      }
      drawFrame(targetFrame)
    }

    const setupScrollTrigger = () => {
      if (disposed || gsapContext || reducedMotion) return
      setFilmActive(true)

      const playback = { frame: targetFrame }
      gsapContext = gsap.context(() => {
        gsap.to(playback, {
          frame: FRAME_COUNT - 1,
          ease: 'none',
          onUpdate: () => queueDraw(playback.frame),
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=3000',
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => setFilmActive(self.isActive),
            onRefresh: (self) => {
              setFilmActive(self.isActive)
              resizeCanvas()
              queueDraw(playback.frame)
            },
          },
        })
      }, section)

      ScrollTrigger.refresh()
    }

    const loadFrame = (index: number) => new Promise<void>((resolve) => {
      const image = images[index]
      image.decoding = 'async'

      image.onload = () => {
        loaded[index] = true
        loadedCount += 1
        canvas.dataset.loadedFrames = String(loadedCount)

        if (!firstFrameReady) {
          firstFrameReady = true
          resizeCanvas()
          drawFrame(targetFrame)
          setupScrollTrigger()
        } else if (Math.abs(index - Math.round(targetFrame)) <= 1) {
          queueDraw(targetFrame)
        }

        // Ask the browser to decode off the critical first paint. The drawn
        // frame uses the nearest loaded image until the exact one is ready.
        try {
          const decoding = image.decode()
          if (decoding) decoding.catch(() => undefined)
        } catch { /* decode() is an enhancement, not a requirement */ }
        resolve()
      }

      image.onerror = () => {
        loadedCount += 1
        canvas.dataset.loadedFrames = String(loadedCount)
        resolve()
      }

      image.src = frameUrl(index)
    })

    const preloadAllFrames = async () => {
      await loadFrame(0)
      if (disposed) return

      let cursor = 1
      const worker = async () => {
        while (!disposed && cursor < FRAME_COUNT) {
          const index = cursor
          cursor += 1
          await loadFrame(index)
        }
      }

      await Promise.all(Array.from({ length: 10 }, () => worker()))
      if (disposed) return
      canvas.dataset.preloadComplete = 'true'
      queueDraw(targetFrame)
    }

    const firstFrameFailSafe = window.setTimeout(() => {
      if (!firstFrameReady) setFilmActive(false)
    }, 8000)

    resizeCanvas()
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resizeCanvas) : null
    resizeObserver?.observe(section)
    window.addEventListener('orientationchange', resizeCanvas)

    void preloadAllFrames()

    return () => {
      disposed = true
      window.clearTimeout(firstFrameFailSafe)
      window.cancelAnimationFrame(rafId)
      resizeObserver?.disconnect()
      window.removeEventListener('orientationchange', resizeCanvas)
      images.forEach((image) => {
        image.onload = null
        image.onerror = null
        image.src = ''
      })
      gsapContext?.revert()
      setFilmActive(false)
    }
  }, [setFilmActive])

  return (
    <>
      {/*
        Presentation-only SPEEDEX sharpening filter. It increases edge acutance
        and colour separation, while the supplied sequence itself remains
        1024×576; it does not synthesize new source detail.
      */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        className="pointer-events-none absolute overflow-hidden"
      >
        <defs>
          <filter id="speedex-ultimate-4k" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
            <feConvolveMatrix
              order="3"
              kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
              preserveAlpha="true"
              result="crisp"
            />
            <feComponentTransfer in="crisp">
              <feFuncR type="linear" slope="1.1" intercept="-0.04" />
              <feFuncG type="linear" slope="1.08" intercept="-0.04" />
              <feFuncB type="linear" slope="1.08" intercept="-0.03" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/*
        Opening canvas sequence. There is intentionally no visible copy or UI
        inside the pinned stage; the value proposition begins immediately
        after the sequence unpins. The hidden H1 is semantic/SEO text only.
      */}
      <section
        ref={sectionRef}
        id="top"
        data-hero-frame-scrub
        aria-label={t.hero_kicker}
        className="hero-section relative isolate h-screen w-screen overflow-hidden"
        style={{ background: '#070709' }}
      >
        <h1 className="sr-only">SPEEDEX — {t.mission}</h1>
        <p className="sr-only">{t.hero_sub}</p>

        <canvas
          ref={canvasRef}
          data-hero-canvas
          aria-hidden="true"
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          className="hero-canvas-sharp absolute inset-0 block h-full w-full object-cover object-center will-change-transform transform-gpu"
        />
      </section>

      {/* The service ticker is after the film, never over it. */}
      <div
        className="relative overflow-hidden py-3"
        style={{
          background: 'linear-gradient(90deg, #140A0F 0%, #6B1D2F 48%, #140A0F 100%)',
          borderTop: '1px solid rgba(197,160,89,.28)',
        }}
        dir="ltr"
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {t.marquee.map((item) => (
                <span key={`${copy}-${item}`} className="font-display px-6 text-[12px] font-semibold tracking-[0.24em] whitespace-nowrap text-[#f5efe4]">
                  {item} <span className="ms-6" style={{ color: 'var(--gold)' }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Visible hero after the sequence: the bilateral Qatar–China corporate mandate. */}
      <section id="gateway" className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36" aria-label="SPEEDEX bilateral trade between Qatar and China">
        <div className="swiss-rules pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
        <div aria-hidden="true" data-drift className="font-display big-outline pointer-events-none absolute -top-4 end-0 text-[22vw] leading-none font-bold opacity-25 select-none">
          SX
        </div>
        <div className="relative mx-auto max-w-[88rem]">
          <p className="kicker reveal"><span className="font-display me-4" style={{ color: 'var(--gold)' }}>00</span>{t.mission_kicker}</p>
          <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-start">
            <h2 className="reveal architectural-heading max-w-5xl text-[clamp(2.5rem,5.4vw,5.7rem)] lg:col-span-7">
              {t.mission}
            </h2>
            <div className="reveal glass-ribbon p-7 lg:col-span-4 lg:col-start-9 lg:mt-24 lg:p-9">
              <div aria-hidden="true" className="hairline mb-6" data-progress-line />
              <p className="leading-8" style={{ color: 'var(--muted)' }}>{t.mission_body}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a href="#trade" className="btn-gold inline-flex min-h-12 items-center rounded-full px-7 text-sm">
                  {t.hero_cta1}
                </a>
                <a href="#consultancy" className="text-link py-3 text-sm font-bold" style={{ color: 'var(--accent-ink)' }}>
                  {t.hero_cta2}
                </a>
              </div>
            </div>
          </div>

          <div className="reveal mt-8 grid gap-x-10 lg:grid-cols-12" data-gateway-data-band>
            {[
              [t.hero_stat1, t.hero_stat1l],
              [t.hero_stat2, t.hero_stat2l],
              [t.hero_stat3, t.hero_stat3l],
            ].map(([value, label], index) => (
              <div
                key={label}
                data-gateway-stat
                className={`swiss-node group ${['lg:col-start-1 lg:col-end-5', 'lg:col-start-6 lg:col-end-9 lg:mt-16', 'lg:col-start-10 lg:col-end-13 lg:mt-7'][index]}`}
                style={{ '--meter': `${[100, 78, 91][index]}%` } as CSSProperties}
              >
                <span className="swiss-node-sheen" aria-hidden="true" />
                <div className="flex items-start justify-between gap-5">
                  <p className="font-display text-2xl font-bold lg:text-3xl" style={{ color: 'var(--gold-2)' }}>{value}</p>
                  <span className="swiss-node-index font-display text-4xl leading-none font-bold" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <p className="mt-2 max-w-sm text-sm leading-6" style={{ color: 'var(--muted)' }}>{label}</p>
                <span className="data-meter mt-6 block" aria-hidden="true"><span className="data-meter-fill" data-meter-fill style={{ width: `${[100, 78, 91][index]}%` }} /></span>
              </div>
            ))}
          </div>

          <div className="reveal mt-6 grid grid-cols-2 gap-x-10 lg:grid-cols-4" data-telemetry>
            {([2, 3, 5, 24] as const).map((value, index) => (
              <div
                key={t.tele_labels[index]}
                data-telemetry-item
                className="swiss-node group"
                style={{ '--meter': `${[100, 86, 92, 78][index]}%` } as CSSProperties}
              >
                <span className="swiss-node-sheen" aria-hidden="true" />
                <p className="font-display text-6xl leading-none font-bold tabular-nums lg:text-7xl" style={{ color: 'var(--text)' }}>
                  <span data-count={value}>0</span>
                  {index === 3 && <span className="text-3xl lg:text-4xl" style={{ color: 'var(--gold-2)' }}>/7</span>}
                </p>
                <p className="mt-3 text-[10px] font-bold tracking-[0.24em] uppercase" style={{ color: 'var(--muted)' }}>
                  {t.tele_labels[index]}
                </p>
                <span className="data-meter mt-5 block" aria-hidden="true">
                  <span className="data-meter-fill" data-meter-fill style={{ width: `${[100, 86, 92, 78][index]}%` }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
