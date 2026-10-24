'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dict, type Lang } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

const THRESHOLDS = [6, 28, 52, 76, 96]
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function BlueprintSkyline({ build }: { build: number }) {
  const towers = [
    { x: 62, w: 116, top: 218, floors: 12 },
    { x: 210, w: 92, top: 126, floors: 16 },
    { x: 336, w: 142, top: 76, floors: 19 },
    { x: 514, w: 104, top: 178, floors: 14 },
    { x: 654, w: 154, top: 54, floors: 20 },
    { x: 842, w: 96, top: 150, floors: 15 },
    { x: 972, w: 132, top: 104, floors: 17 },
  ]
  const ground = 660
  const floorH = 25

  return (
    <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice" className="h-full w-full" role="img" aria-label="Architectural blueprint of a Qatar corporate skyline">
      <line x1="24" y1={ground} x2="1176" y2={ground} stroke="#9fd0ff" strokeWidth="1.5" strokeDasharray="10 7" opacity="0.82" />
      {towers.map((tower, towerIndex) => (
        <g key={towerIndex}>
          <rect x={tower.x} y={tower.top} width={tower.w} height={ground - tower.top} fill="rgba(80,150,220,.05)" stroke="#9fd0ff" strokeWidth="1.7" strokeDasharray={build > 90 ? '0' : '8 5'} />
          <line x1={tower.x - 16} y1={tower.top} x2={tower.x + tower.w + 16} y2={tower.top} stroke="#E5C98C" strokeWidth="1" opacity="0.72" />
          <line x1={tower.x + tower.w / 2} y1={tower.top} x2={tower.x + tower.w / 2} y2={ground} stroke="#9fd0ff" strokeWidth="0.55" opacity="0.48" />
          {Array.from({ length: tower.floors }).map((_, floor) => {
            const y = ground - (floor + 1) * floorH
            if (y < tower.top + 5) return null
            const on = build >= ((floor + 1) / 20) * 100
            return (
              <g key={floor} opacity={on ? 1 : 0.28}>
                <line x1={tower.x} y1={y + floorH} x2={tower.x + tower.w} y2={y + floorH} stroke="#9fd0ff" strokeWidth="0.65" />
                {[0.16, 0.42, 0.68].map((wx) => (
                  <rect
                    key={wx}
                    x={tower.x + tower.w * wx}
                    y={y + 6}
                    width={tower.w * 0.16}
                    height="10"
                    rx="1.5"
                    fill={on ? '#e8c87a' : 'none'}
                    stroke="#9fd0ff"
                    strokeWidth="0.65"
                  />
                ))}
              </g>
            )
          })}
        </g>
      ))}
      <text x="34" y="42" fill="#9fd0ff" fontSize="13" letterSpacing="4" fontFamily="monospace">DWG-QA-001 · QATAR CORPORATE DISTRICT</text>
      <text x="34" y="688" fill="#9fd0ff" fontSize="11" letterSpacing="3" fontFamily="monospace" opacity="0.72">SCALE 1:500 — IDEA → ENTITY → LAUNCH</text>
      <circle cx="1148" cy="48" r="22" fill="none" stroke="#E5C98C" strokeWidth="1.2" />
      <text x="1148" y="54" fill="#E5C98C" fontSize="14" textAnchor="middle" fontFamily="monospace">N↑</text>
    </svg>
  )
}

export default function CorporateSetup({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const [build, setBuild] = useState(0)
  const [boardBuild, setBoardBuild] = useState(0)
  const pinRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const boardPlayedRef = useRef(false)
  const boardTouchedRef = useRef(false)
  const boardAnimRef = useRef(0)
  const imageMotionRef = useRef<HTMLDivElement>(null)
  const manualRef = useRef(false)
  const lastProgressRef = useRef(0)
  const animRef = useRef(0)

  const play = () => {
    cancelAnimationFrame(animRef.current)
    manualRef.current = true
    const started = performance.now()
    setBuild(0)
    const step = (now: number) => {
      const progress = clamp((now - started) / 3300, 0, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setBuild(Math.round(eased * 100))
      if (progress < 1 && manualRef.current) animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
  }

  const playBoard = () => {
    cancelAnimationFrame(boardAnimRef.current)
    const started = performance.now()
    setBoardBuild(0)
    const step = (now: number) => {
      const progress = clamp((now - started) / 3300, 0, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setBoardBuild(Math.round(eased * 100))
      if (progress < 1 && !boardTouchedRef.current) boardAnimRef.current = requestAnimationFrame(step)
    }
    boardAnimRef.current = requestAnimationFrame(step)
  }

  useLayoutEffect(() => {
    const pin = pinRef.current
    if (!pin) return

    const trigger = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        if (manualRef.current && Math.abs(self.progress - lastProgressRef.current) < 0.015) return
        manualRef.current = false
        cancelAnimationFrame(animRef.current)
        lastProgressRef.current = self.progress
        setBuild(Math.round(self.progress * 100))
      },
    })

    const motion = imageMotionRef.current
      ? gsap.fromTo(imageMotionRef.current, { yPercent: -3.5, scale: 1.05 }, {
          yPercent: 3.5,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: { trigger: pin, start: 'top top', end: 'bottom bottom', scrub: true },
        })
      : null

    return () => {
      trigger.kill()
      motion?.scrollTrigger?.kill()
      motion?.kill()
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  useEffect(() => {
    const board = boardRef.current
    if (!board) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      boardPlayedRef.current = true
      setBoardBuild(100)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || boardPlayedRef.current || boardTouchedRef.current) return
      boardPlayedRef.current = true
      playBoard()
      observer.disconnect()
    }, { threshold: 0.35 })

    observer.observe(board)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(boardAnimRef.current)
    }
    // The board intentionally auto-plays once, on first visibility.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Narrative interlude: trade hands the story to incorporation. */}
      <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-10" aria-label={t.arrival_kicker}>
        <div aria-hidden="true" className="font-display big-outline pointer-events-none absolute top-8 start-0 text-[19vw] leading-none font-bold opacity-20 select-none">QATAR</div>
        <div className="relative mx-auto max-w-[72rem] text-center">
          <p className="kicker reveal">{t.arrival_kicker}</p>
          <h2 className={`reveal mx-auto mt-6 max-w-4xl text-4xl leading-[1.04] font-semibold sm:text-6xl ${lang === 'ar' ? 'font-display' : 'font-serif-lux'}`}>
            {t.arrival_title}
          </h2>
          <p className="reveal mx-auto mt-6 max-w-2xl leading-8" style={{ color: 'var(--muted)' }}>{t.arrival_body}</p>
          <div aria-hidden="true" className="hairline mx-auto mt-10 max-w-xl" data-progress-line />
        </div>
      </section>

      <section id="setup" className="relative scroll-mt-20">
        <div className="mx-auto max-w-[88rem] px-5 pb-14 sm:px-8 lg:px-10">
          <div className="reveal grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="kicker">{t.setup_kicker}</p>
              <h2 className={`mt-5 max-w-4xl text-4xl leading-[1.02] font-semibold sm:text-6xl ${lang === 'ar' ? 'font-display' : 'font-serif-lux'}`}>
                {t.setup_title}
              </h2>
            </div>
            <div>
              <div aria-hidden="true" className="hairline mb-6" data-progress-line />
              <p className="leading-8" style={{ color: 'var(--muted)' }}>{t.setup_sub}</p>
            </div>
          </div>
        </div>

        {/*
          Client-supplied setup board, ported as native responsive content:
          stage + checklist/control panel + legal-platform cards. It keeps its
          own boardBuild state so the fullscreen film below cannot overwrite it.
        */}
        <div className="mx-auto max-w-[88rem] px-5 pb-16 sm:px-8 lg:px-10">
          <div ref={boardRef} data-setup-board data-board-build={boardBuild}>
            <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
              <div
                className="board-stage-shell blueprint-grid relative h-[430px] overflow-hidden bg-[#0a1624] text-white sm:h-[540px]"
                style={{ boxShadow: 'var(--shadow-photo)' }}
              >
                <div className="absolute inset-0 p-4 transition-opacity duration-700" style={{ opacity: 1 - boardBuild / 160 }}>
                  <BlueprintSkyline build={boardBuild} />
                </div>
                <div className="absolute inset-0" style={{ clipPath: `inset(${100 - boardBuild}% 0 0 0)`, transition: 'clip-path .15s linear' }}>
                  <Image
                    src="/assets/doha-skyline-real.jpg"
                    alt="Real daytime photograph of corporate towers in Qatar"
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover object-[50%_38%]"
                  />
                  <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(43,7,18,.55))' }} />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 h-[3px]"
                  style={{
                    bottom: `${boardBuild}%`,
                    background: 'linear-gradient(90deg,transparent,#e8c87a,#fff,#e8c87a,transparent)',
                    boxShadow: '0 0 22px rgba(232,200,122,.9)',
                    opacity: boardBuild > 2 && boardBuild < 99 ? 1 : 0,
                  }}
                />
                <span className="glass-chip absolute top-4 start-4 px-3 py-1.5 text-[10px] font-bold tracking-[.22em] text-white">
                  BLUEPRINT · مخطط · 蓝图
                </span>
                <span
                  className="glass-chip absolute end-4 bottom-4 px-3 py-1.5 text-[10px] font-bold tracking-[.22em] text-white transition-opacity duration-500"
                  style={{ background: 'linear-gradient(125deg,#8A3049,#6B1D2F 55%,#35101C)', opacity: boardBuild > 55 ? 1 : 0.25 }}
                >
                  REALITY · واقع · 现实
                </span>
                <span className="font-display absolute bottom-4 start-5 text-5xl font-bold text-white tabular-nums drop-shadow-lg">
                  {boardBuild}<span className="text-xl text-[#E5C98C]">%</span>
                </span>
              </div>

              <div className="glass-ribbon flex flex-col p-6 sm:p-7" data-board-control-ribbon>
                <ol className="flex-1">
                  {t.stages.map(([title, body], index) => {
                    const on = boardBuild >= THRESHOLDS[index]
                    return (
                      <li
                        key={title}
                        data-setup-board-stage
                        data-on={on}
                        className="board-stage-row flex gap-4 px-4 py-3.5"
                        style={{
                          background: on ? 'linear-gradient(90deg, color-mix(in srgb, var(--gold) 9%, transparent), transparent 72%)' : 'transparent',
                          opacity: on ? 1 : 0.55,
                        }}
                      >
                        <span
                          className="mt-1 grid h-8 w-8 shrink-0 rotate-45 place-items-center text-xs font-bold"
                          style={{
                            background: on ? 'var(--mark)' : 'color-mix(in srgb, var(--text) 8%, transparent)',
                            color: on ? '#fff' : 'var(--muted)',
                          }}
                        >
                          <span className="-rotate-45">{on ? '✓' : index + 1}</span>
                        </span>
                        <span>
                          <span className="block text-sm font-bold">{title}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{body}</span>
                        </span>
                      </li>
                    )
                  })}
                </ol>

                <label htmlFor="setup-board-build-range" className="mt-6 block">
                  <span className="text-[10px] font-semibold tracking-[.22em] uppercase" style={{ color: 'var(--faint)' }}>{t.build}</span>
                  <input
                    id="setup-board-build-range"
                    type="range"
                    min={0}
                    max={100}
                    value={boardBuild}
                    className="lux-range mt-3"
                    onChange={(event) => {
                      boardTouchedRef.current = true
                      boardPlayedRef.current = true
                      cancelAnimationFrame(boardAnimRef.current)
                      setBoardBuild(Number(event.target.value))
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    boardTouchedRef.current = false
                    boardPlayedRef.current = true
                    playBoard()
                  }}
                  className="btn-gold mt-4 min-h-12 rounded-full px-5 py-3 text-sm"
                >
                  {t.replay}
                </button>
              </div>
            </div>

            <div className="mt-10" data-setup-board-cards data-setup-platform-ribbons>
              {t.setup_cards.map(([title, body, badge], index) => (
                <article
                  key={title}
                  data-setup-platform-ribbon
                  className={`platform-ribbon group grid gap-4 py-7 md:grid-cols-[5rem_1fr_1.2fr_auto] md:items-start ${['lg:me-[30%]', 'lg:ms-[20%] lg:me-[9%]', 'lg:ms-[38%]'][index]}`}
                >
                  <span className="swiss-node-index font-display text-6xl leading-none font-bold" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="architectural-subhead text-xl">{title}</h3>
                  <p className="max-w-xl text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{body}</p>
                  <span className="font-display text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'var(--accent-ink)' }}>
                    {badge}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Blueprint → Reality as a fullscreen scroll construction. */}
        <div ref={pinRef} className="relative h-[340svh] lg:h-[370svh]">
          <div className="sticky top-0 h-svh overflow-hidden bg-[#0a1624] text-white" style={{ boxShadow: 'var(--shadow-photo)' }}>
            <div ref={imageMotionRef} className="absolute inset-[-5%_0]">
              <Image
                src="/assets/doha-skyline-real.jpg"
                alt="Real daytime photograph of corporate towers in Qatar"
                fill
                sizes="100vw"
                className="object-cover object-[50%_38%]"
                style={{
                  filter: `saturate(${0.28 + build * 0.0075}) contrast(${0.94 + build * 0.0012}) brightness(${0.58 + build * 0.0045})`,
                  transition: 'filter .18s linear',
                }}
              />
            </div>

            <div
              aria-hidden="true"
              className="blueprint-grid absolute inset-0"
              style={{ clipPath: `inset(0 0 ${build}% 0)`, opacity: clamp(1 - build / 135, 0.18, 1), transition: 'clip-path .12s linear, opacity .3s ease' }}
            >
              <div className="absolute inset-0 pt-16 pb-24"><BlueprintSkyline build={build} /></div>
            </div>

            <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,5,10,.42), transparent 30%, transparent 58%, rgba(3,5,10,.78))' }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[58%]" style={{ background: 'linear-gradient(180deg, transparent 12%, rgba(3,5,10,.34) 52%, rgba(3,5,10,.82) 100%)' }} />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 z-20 h-[3px]"
              style={{
                bottom: `${build}%`,
                background: 'linear-gradient(90deg,transparent,#e8c87a,#fff,#e8c87a,transparent)',
                boxShadow: '0 0 28px rgba(232,200,122,.85)',
                opacity: build > 1 && build < 99 ? 1 : 0,
              }}
            />

            <span className="absolute top-24 start-5 z-30 text-[9px] font-bold tracking-[0.28em] text-[#9fd0ff] uppercase sm:start-9">
              Blueprint · مخطط · 蓝图
            </span>
            <span
              className="absolute top-24 end-5 z-30 text-[9px] font-bold tracking-[0.28em] text-[#E5C98C] uppercase transition-opacity duration-500 sm:end-9"
              style={{ opacity: build > 48 ? 1 : 0.28 }}
            >
              Reality · واقع · 现实
            </span>

            <div className="pointer-events-none absolute start-5 bottom-36 z-20 sm:start-9 lg:bottom-40" style={{ textShadow: '0 3px 18px rgba(0,0,0,.88)' }}>
              <div className="font-display text-7xl leading-none font-bold tabular-nums drop-shadow-2xl sm:text-8xl">
                {build}<span className="text-3xl text-[#E5C98C]">%</span>
              </div>
            </div>

            {/* Precision control, integrated into the lower edge. */}
            <div className="soft-glass-line absolute inset-x-0 bottom-0 z-30 px-5 py-5 sm:px-9" style={{ borderTop: '1px solid rgba(232,213,168,.22)' }}>
              <div className="mx-auto grid max-w-[88rem] items-center gap-4 md:grid-cols-[auto_1fr_auto]">
                <label htmlFor="corporate-build-range" className="text-[9px] font-bold tracking-[0.28em] text-white/58 uppercase">
                  {t.build}
                </label>
                <input
                  id="corporate-build-range"
                  type="range"
                  min={0}
                  max={100}
                  value={build}
                  className="lux-range"
                  onChange={(event) => {
                    manualRef.current = true
                    cancelAnimationFrame(animRef.current)
                    setBuild(Number(event.target.value))
                  }}
                />
                <button type="button" onClick={play} className="text-link justify-self-start py-2 text-sm font-bold text-[#E5C98C] md:justify-self-end">
                  {t.replay}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-10">
          <p className="flex flex-wrap gap-x-2 gap-y-1 pt-3 text-[10px] leading-relaxed" style={{ color: 'var(--faint)' }}>
            <span>{t.photo_credit_day_label}:</span>
            <a className="underline decoration-[#C5A059]/50 underline-offset-2 transition hover:text-[#E5C98C]" href="https://commons.wikimedia.org/wiki/File:Doha_Skyline_10.jpg" target="_blank" rel="noreferrer">Zairon — Qatar corporate skyline</a>
            <span aria-hidden="true">·</span>
            <a className="underline decoration-[#C5A059]/50 underline-offset-2 transition hover:text-[#E5C98C]" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
            <span>via Wikimedia Commons; cropped &amp; colour-graded.</span>
          </p>

          <div className="py-20 sm:py-28">
            <div className="reveal grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="kicker">{t.structure_kicker}</p>
                <h3 className={`mt-4 text-3xl font-semibold sm:text-5xl ${lang === 'ar' ? 'font-display' : 'font-serif-lux'}`}>{t.structure_title}</h3>
              </div>
              <p dir="ltr" className="font-display text-xs font-bold tracking-[0.26em]" style={{ color: 'var(--gold)' }}>MOCI · QFC · QFZ</p>
            </div>

            <div className="mt-12" style={{ borderTop: '1px solid var(--line)' }}>
              {t.setup_cards.map(([title, body, badge], index) => (
                <article
                  key={title}
                  className="reveal editorial-row group grid gap-4 py-9 md:grid-cols-[7rem_1fr_1.2fr_auto] md:items-center"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <span className="font-display big-outline text-6xl leading-none font-bold">0{index + 1}</span>
                  <h4 className={`text-2xl font-semibold sm:text-3xl ${lang === 'ar' ? 'font-display' : 'font-serif-lux'}`}>{title}</h4>
                  <p className="max-w-xl leading-7" style={{ color: 'var(--muted)' }}>{body}</p>
                  <span className="text-[10px] font-bold tracking-[0.24em] uppercase" style={{ color: 'var(--gold)' }}>{badge}</span>
                </article>
              ))}
            </div>
            <p className="reveal mt-5 text-[11px] leading-5" style={{ color: 'var(--faint)' }}>{t.setup_note}</p>
          </div>
        </div>
      </section>
    </>
  )
}
