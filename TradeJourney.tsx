'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { dict, type Lang } from '@/lib/i18n'
import Planner from '@/components/Planner'

gsap.registerPlugin(ScrollTrigger)

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export default function TradeJourney({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const isRtl = t.dir === 'rtl'
  const [split, setSplit] = useState(88)
  const [activePhase, setActivePhase] = useState(0)
  const pinRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const BeijingMotionRef = useRef<HTMLDivElement>(null)
  const dohaMotionRef = useRef<HTMLDivElement>(null)
  const manualRef = useRef(false)
  const lastProgressRef = useRef(0)

  const applySplit = useCallback((next: number) => {
    const value = clamp(next, 8, 92)
    setSplit((previous) => (Math.abs(previous - value) > 0.08 ? value : previous))
    const journey = clamp((88 - value) / 76, 0, 0.9999)
    const phase = Math.min(3, Math.floor(journey * 4))
    setActivePhase((previous) => (previous === phase ? previous : phase))
  }, [])

  useLayoutEffect(() => {
    const pin = pinRef.current
    if (!pin) return

    applySplit(88)
    const trigger = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        if (manualRef.current && Math.abs(self.progress - lastProgressRef.current) < 0.015) return
        manualRef.current = false
        lastProgressRef.current = self.progress
        applySplit(88 - self.progress * 76)
      },
    })

    const motions = [
      BeijingMotionRef.current
        ? gsap.fromTo(BeijingMotionRef.current, { xPercent: isRtl ? -2.4 : 2.4, yPercent: -1.6, scale: 1.04 }, {
            xPercent: isRtl ? 1.2 : -1.2,
            yPercent: 1.6,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: { trigger: pin, start: 'top top', end: 'bottom bottom', scrub: true },
          })
        : null,
      dohaMotionRef.current
        ? gsap.fromTo(dohaMotionRef.current, { xPercent: isRtl ? 2 : -2, yPercent: 1.4, scale: 1.08 }, {
            xPercent: isRtl ? -1 : 1,
            yPercent: -1.4,
            scale: 1.03,
            ease: 'none',
            scrollTrigger: { trigger: pin, start: 'top top', end: 'bottom bottom', scrub: true },
          })
        : null,
    ]

    return () => {
      trigger.kill()
      motions.forEach((motion) => {
        motion?.scrollTrigger?.kill()
        motion?.kill()
      })
    }
  }, [applySplit, isRtl])

  const setFromPointer = (clientX: number) => {
    const rect = sceneRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    manualRef.current = true
    applySplit(isRtl ? 100 - pct : pct)
  }

  const journeyPct = Math.round(clamp((88 - split) / 76, 0, 1) * 100)
  const [phaseTitle, phaseBody] = t.services[activePhase]

  return (
    <>
      <section id="trade" className="relative scroll-mt-20">
        <div className="mx-auto max-w-[88rem] px-5 pt-10 pb-14 sm:px-8 lg:px-10">
          <div className="reveal grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="kicker">{t.trade_kicker}</p>
              <h2 className={`mt-5 max-w-4xl text-4xl leading-[1.02] font-semibold sm:text-6xl ${lang === 'ar' ? 'font-display' : 'font-serif-lux'}`}>
                {t.trade_title}
              </h2>
            </div>
            <div>
              <div aria-hidden="true" className="hairline mb-6" data-progress-line />
              <p className="leading-8" style={{ color: 'var(--muted)' }}>{t.trade_sub}</p>
              <p className="font-display mt-5 text-xs font-bold tracking-[0.26em]" style={{ color: 'var(--gold)' }}>
                {t.route_scope}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll film: Beijing physically gives way to Doha. CSS sticky keeps it robust with Smooth and RTL. */}
        <div ref={pinRef} className="relative h-[340svh] lg:h-[380svh]">
          <div className="sticky top-0 h-svh overflow-hidden bg-[#070709]" style={{ boxShadow: 'var(--shadow-photo)' }}>
            <figure className="absolute inset-0">
              <div
                ref={sceneRef}
                className="group absolute inset-0 cursor-ew-resize touch-pan-y select-none"
                role="slider"
                tabIndex={0}
                aria-label={`${t.compare_left} — ${t.compare_right}`}
                aria-valuemin={8}
                aria-valuemax={92}
                aria-valuenow={Math.round(split)}
                aria-valuetext={`${journeyPct}%`}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture?.(event.pointerId)
                  setFromPointer(event.clientX)
                }}
                onPointerMove={(event) => {
                  if (event.buttons === 1) setFromPointer(event.clientX)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft') { manualRef.current = true; applySplit(split - 4) }
                  if (event.key === 'ArrowRight') { manualRef.current = true; applySplit(split + 4) }
                  if (event.key === 'Home') { manualRef.current = true; applySplit(88) }
                  if (event.key === 'End') { manualRef.current = true; applySplit(12) }
                }}
              >
                {/* Destination layer */}
                <div ref={dohaMotionRef} className="absolute inset-[-4%]">
                  <Image
                    src="/assets/doha-west-bay-real.jpg"
                    alt="Commercial skyline in Qatar at night"
                    fill
                    sizes="100vw"
                    className="object-cover object-[50%_46%]"
                    draggable={false}
                  />
                </div>

                {/* Origin layer clipped by the moving seam */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: isRtl ? `inset(0 0 0 ${100 - split}%)` : `inset(0 ${100 - split}% 0 0)` }}
                >
                  <div ref={BeijingMotionRef} className="absolute inset-[-4%]">
                    <Image
                      src="/assets/beijing-cbd-real.jpg"
                      alt="Industrial and commercial skyline in China"
                      fill
                      sizes="100vw"
                      className="object-cover object-[50%_10%]"
                      draggable={false}
                    />
                  </div>
                </div>

                <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(4,1,5,.58) 0%, transparent 30%, transparent 52%, rgba(4,1,5,.82) 100%)' }} />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-65" style={{ background: 'linear-gradient(115deg, rgba(138,21,56,.18), transparent 46%, rgba(201,168,106,.1))' }} />

                <div className="pointer-events-none absolute inset-x-0 top-24 z-20 flex justify-center px-5">
                  <span className="soft-glass-line rounded-full px-4 py-2 text-[9px] font-bold tracking-[0.24em] text-white/86 uppercase" style={{ border: '1px solid rgba(232,213,168,.22)' }}>
                    {t.trade_scroll_label}
                  </span>
                </div>

                <div className="pointer-events-none absolute start-4 bottom-60 z-20 max-w-[45%] text-white transition-opacity duration-300 sm:start-9 sm:bottom-48 sm:max-w-[76%]" style={{ opacity: split > 18 ? 1 : 0 }}>
                  <span dir="ltr" className="block text-[8px] font-bold tracking-[0.18em] text-[#E5C98C] sm:text-[9px] sm:tracking-[0.3em]" style={{ textShadow: '0 2px 12px rgba(0,0,0,.8)' }}>CHN · INDUSTRIAL NETWORK</span>
                  <span className="font-display mt-2 block text-[clamp(1.05rem,5.2vw,1.65rem)] leading-[1.05] font-bold text-balance sm:text-5xl" style={{ textShadow: '0 5px 28px rgba(0,0,0,.78)' }}>{t.compare_left}</span>
                  <span className="mt-2 hidden text-xs text-white/74 min-[430px]:block sm:text-sm" style={{ textShadow: '0 2px 12px rgba(0,0,0,.8)' }}>{t.photo_beijing_sub}</span>
                </div>

                <div className="pointer-events-none absolute end-4 bottom-60 z-20 max-w-[45%] text-end text-white transition-opacity duration-300 sm:end-9 sm:bottom-48 sm:max-w-[76%]" style={{ opacity: split < 82 ? 1 : 0 }}>
                  <span dir="ltr" className="block text-[8px] font-bold tracking-[0.18em] text-[#E5C98C] sm:text-[9px] sm:tracking-[0.3em]" style={{ textShadow: '0 2px 12px rgba(0,0,0,.8)' }}>QAT · COMMERCIAL NETWORK</span>
                  <span className="font-display mt-2 block text-[clamp(1.05rem,5.2vw,1.65rem)] leading-[1.05] font-bold text-balance sm:text-5xl" style={{ textShadow: '0 5px 28px rgba(0,0,0,.78)' }}>{t.compare_right}</span>
                  <span className="mt-2 hidden text-xs text-white/74 min-[430px]:block sm:text-sm" style={{ textShadow: '0 2px 12px rgba(0,0,0,.8)' }}>{t.photo_doha_sub}</span>
                </div>

                {/* Gold seam / drag handle */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-30" style={{ insetInlineStart: `calc(${split}% - 1px)` }}>
                  <div className="h-full w-[2px]" style={{ background: 'linear-gradient(180deg, transparent, #E5C98C 16%, #fff8e6 50%, #E5C98C 84%, transparent)', boxShadow: '0 0 24px rgba(232,213,168,.55)' }} />
                  <div className="soft-glass-line absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-lg text-[#E5C98C]" style={{ border: '1px solid rgba(232,213,168,.72)' }}>
                    ↔
                  </div>
                </div>

                {/* Phase readout is a full-bleed lower band, not a floating card. */}
                <div className="soft-glass-line pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 py-5 text-white sm:px-9 sm:py-6" style={{ borderTop: '1px solid rgba(232,213,168,.22)' }}>
                  <div className="mx-auto grid max-w-[88rem] items-end gap-4 md:grid-cols-[auto_1fr_auto]">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display big-outline text-5xl leading-none font-bold sm:text-6xl">0{activePhase + 1}</span>
                      <span className="text-[9px] font-bold tracking-[0.24em] text-[#E5C98C] uppercase">{t.compare_hint}</span>
                    </div>
                    <div key={`${lang}-${activePhase}`} className="min-w-0">
                      <h3 className="font-display text-xl font-bold sm:text-2xl">{phaseTitle}</h3>
                      <p className="mt-1 max-w-2xl text-xs leading-5 text-white/68 sm:text-sm sm:leading-6">{phaseBody}</p>
                    </div>
                    <div className="hidden text-end md:block">
                      <div className="font-display text-4xl font-bold tabular-nums">{journeyPct}<span className="text-lg text-[#E5C98C]">%</span></div>
                      <div dir="ltr" className="mt-1 text-[9px] tracking-[0.24em] text-white/46">QAT ↔ CHN</div>
                    </div>
                  </div>
                  <div aria-hidden="true" className="mx-auto mt-4 h-px max-w-[88rem] bg-white/12">
                    <div className="h-full bg-gradient-to-r from-[#84314A] via-[#e05778] to-[#E5C98C] transition-[width] duration-100" style={{ width: `${journeyPct}%` }} />
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </div>

        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-10">
          <p className="flex flex-wrap gap-x-2 gap-y-1 pt-3 text-[10px] leading-relaxed" style={{ color: 'var(--faint)' }}>
            <span>{t.photo_credit_label}:</span>
            <a className="underline decoration-[#C5A059]/50 underline-offset-2 transition hover:text-[#E5C98C]" href="https://commons.wikimedia.org/wiki/File:Beijing_Central_Business_District_(20240826163226).jpg" target="_blank" rel="noreferrer">HoweyYuan — China commercial skyline</a>
            <span aria-hidden="true">·</span>
            <a className="underline decoration-[#C5A059]/50 underline-offset-2 transition hover:text-[#E5C98C]" href="https://commons.wikimedia.org/wiki/File:Doha_West_Bay_Skyline_Qatar_Jan_2020.jpg" target="_blank" rel="noreferrer">Thameur Belghith — Qatar commercial skyline</a>
            <span aria-hidden="true">·</span>
            <a className="underline decoration-[#C5A059]/50 underline-offset-2 transition hover:text-[#E5C98C]" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
            <span>via Wikimedia Commons; cropped &amp; colour-graded.</span>
          </p>

          {/* Services as an editorial index — lines and type, no card grid. */}
          <div className="mt-16 sm:mt-24" style={{ borderTop: '1px solid var(--line)' }} data-editorial-trade-services>
            {t.services.map(([title, body], index) => (
              <article
                key={title}
                data-trade-service
                className={`reveal editorial-row group grid gap-4 py-8 sm:py-10 md:grid-cols-[7rem_1fr_1.15fr_auto] md:items-center xl:grid-cols-[8rem_1fr_1.15fr_9rem_auto] ${index % 2 ? 'xl:ms-[7%]' : 'xl:me-[7%]'}`}
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <span className="swiss-node-index font-display text-6xl leading-none font-bold sm:text-7xl">0{index + 1}</span>
                <h3 className="architectural-subhead text-2xl leading-tight sm:text-3xl">{title}</h3>
                <p className="max-w-xl leading-7" style={{ color: 'var(--muted)' }}>{body}</p>
                <span className="data-meter hidden xl:block" aria-hidden="true">
                  <span className="data-meter-fill" data-meter-fill style={{ width: `${[88, 76, 94, 84][index]}%` }} />
                </span>
                <span aria-hidden="true" className={`font-display hidden text-3xl transition-transform duration-500 md:block ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} style={{ color: 'var(--gold)' }}>
                  {isRtl ? '↖' : '↗'}
                </span>
              </article>
            ))}
          </div>

          {/* Checkpoints as one continuous route. */}
          <div className="reveal py-20 sm:py-28">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="kicker">{t.steps_kicker}</p>
                <h3 className="architectural-heading mt-4 text-3xl sm:text-5xl">{t.steps_title}</h3>
              </div>
              <p dir="ltr" className="font-display text-xs font-bold tracking-[0.26em]" style={{ color: 'var(--gold)' }}>BRIEF — SOURCE — VERIFY — SHIP — DELIVER</p>
            </div>

            <div className="relative mt-12">
              <div aria-hidden="true" className="absolute top-[13px] inset-x-0 hidden h-px md:block" style={{ background: 'var(--line)' }} />
              <div aria-hidden="true" className="absolute top-[13px] inset-x-0 hidden h-[2px] md:block" data-progress-line style={{ background: 'linear-gradient(90deg, var(--maroon), var(--wine), var(--gold))' }} />
              <ol className="relative grid gap-9 md:grid-cols-5 md:gap-5">
                {t.steps.map(([title, body], index) => (
                  <li key={title} data-route-checkpoint className="group relative ps-10 transition-transform duration-500 motion-safe:hover:-translate-y-1 md:ps-0 md:pt-12">
                    <span
                      aria-hidden="true"
                      className="absolute start-0 top-0 grid h-[27px] w-[27px] rotate-45 place-items-center text-[10px] font-bold text-white transition-transform duration-500 group-hover:scale-110 md:start-0"
                      style={{ background: index === 4 ? 'var(--gold)' : 'var(--maroon)', color: index === 4 ? '#260914' : '#fff', boxShadow: '0 0 0 7px var(--bg)' }}
                    >
                      <span className="-rotate-45">{index + 1}</span>
                    </span>
                    <h4 className="architectural-subhead text-lg">{title}</h4>
                    <p className="mt-2 max-w-[260px] text-sm leading-6" style={{ color: 'var(--muted)' }}>{body}</p>
                    <span className="data-meter mt-5 block max-w-[180px]" aria-hidden="true">
                      <span className="data-meter-fill" data-meter-fill style={{ width: `${20 + index * 20}%` }} />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <Planner lang={lang} />
    </>
  )
}
