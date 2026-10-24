import { useEffect, useRef, useState } from 'react'
import { dict, type Lang } from '../i18n'

const THRESHOLDS = [6, 28, 52, 76, 96]

function BlueprintSVG({ build }: { build: number }) {
  // Three stylised West Bay towers; windows light floor-by-floor as build rises.
  const towers = [
    { x: 70, w: 90, floors: 13, top: 90 },
    { x: 185, w: 110, floors: 17, top: 30 },
    { x: 320, w: 84, floors: 11, top: 120 },
  ]
  const H = 430, floorH = 19
  return (
    <svg viewBox="0 0 480 430" className="h-full w-full" role="img" aria-label="Blueprint of a Doha tower under construction">
      <line x1="20" y1={H - 12} x2="460" y2={H - 12} stroke="#9fd0ff" strokeWidth="1.5" strokeDasharray="8 5" opacity=".8" />
      {towers.map((tw, ti) => (
        <g key={ti}>
          <rect x={tw.x} y={tw.top} width={tw.w} height={H - 12 - tw.top} fill="none" stroke="#9fd0ff" strokeWidth="1.6" strokeDasharray={build > 90 ? '0' : '7 4'} />
          <line x1={tw.x - 12} y1={tw.top} x2={tw.x + tw.w + 12} y2={tw.top} stroke="#e8d5a8" strokeWidth="1" opacity=".7" />
          {Array.from({ length: tw.floors }).map((_, f) => {
            const builtAt = ((f + 1) / 17) * 100
            const on = build >= builtAt
            const y = H - 12 - (f + 1) * floorH
            if (y < tw.top + 4) return null
            return (
              <g key={f} opacity={on ? 1 : 0.28}>
                <line x1={tw.x} y1={y + floorH} x2={tw.x + tw.w} y2={y + floorH} stroke="#9fd0ff" strokeWidth=".7" />
                {[0.18, 0.42, 0.66].map((wx) => (
                  <rect key={wx} x={tw.x + tw.w * wx} y={y + 4} width={tw.w * 0.16} height={9} rx="1.5"
                    fill={on ? '#e8c87a' : 'none'} stroke="#9fd0ff" strokeWidth=".7" />
                ))}
              </g>
            )
          })}
        </g>
      ))}
      <text x="26" y="34" fill="#9fd0ff" fontSize="11" letterSpacing="3" fontFamily="monospace">DWG-QA-001 · WEST BAY, DOHA</text>
      <text x="26" y={H - 26} fill="#9fd0ff" fontSize="10" letterSpacing="2" fontFamily="monospace" opacity=".7">SCALE 1:500 — IDEA → ENTITY</text>
      <circle cx="428" cy="40" r="17" fill="none" stroke="#e8d5a8" strokeWidth="1.2" />
      <text x="428" y="45" fill="#e8d5a8" fontSize="12" textAnchor="middle" fontFamily="monospace">N↑</text>
    </svg>
  )
}

export default function Corporate({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const [build, setBuild] = useState(0)
  const touched = useRef(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)

  const play = () => {
    cancelAnimationFrame(animRef.current)
    const t0 = performance.now(), from = 0
    setBuild(0)
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 3200)
      setBuild(Math.round(from + (100 - from) * (1 - Math.pow(1 - p, 3))))
      if (p < 1 && !touched.current) animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
  }
  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { play(); io.disconnect() } }, { threshold: 0.35 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(animRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id="setup" className="scroll-mt-20 py-24 sm:py-32" style={{ background: 'linear-gradient(180deg, transparent, var(--bg-2) 18%, var(--bg-2) 82%, transparent)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal max-w-3xl">
          <p className="kicker">{t.setup_kicker}</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.04] font-bold sm:text-6xl">{t.setup_title}</h2>
          <p className="mt-5 leading-relaxed" style={{ color: 'var(--muted)' }}>{t.setup_sub}</p>
        </div>

        <div ref={sectionRef} className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          {/* Blueprint → Reality stage */}
          <div className="reveal blueprint-grid relative h-[460px] overflow-hidden rounded-[28px] sm:h-[540px]" style={{ border: '1px solid rgba(159,208,255,.35)', boxShadow: 'var(--card-shadow)' }}>
            <div className="absolute inset-0 p-4 transition-opacity duration-700" style={{ opacity: 1 - build / 160 }}><BlueprintSVG build={build} /></div>
            <div className="absolute inset-0" style={{ clipPath: `inset(${100 - build}% 0 0 0)`, transition: 'clip-path .15s linear' }}>
              <img src="/assets/doha-waterfront.jpg" alt="Finished Doha skyline — the completed reality" className="h-full w-full object-cover object-[50%_30%]" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(43,7,18,.55))' }} />
            </div>
            {/* construction scanline */}
            <div className="pointer-events-none absolute inset-x-0 h-[3px]" style={{ bottom: `${build}%`, background: 'linear-gradient(90deg,transparent,#e8c87a,#fff,#e8c87a,transparent)', boxShadow: '0 0 22px #e8c87a', opacity: build > 2 && build < 99 ? 1 : 0 }} />
            <span className="absolute top-4 start-4 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-bold tracking-[.22em] text-white backdrop-blur">BLUEPRINT · مخطط · 蓝图</span>
            <span className="absolute end-4 bottom-4 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[.22em] text-white" style={{ background: 'var(--maroon)', opacity: build > 55 ? 1 : 0.25, transition: '.5s' }}>REALITY · واقع · 现实</span>
            <span className="font-display absolute bottom-4 start-5 text-5xl font-bold text-white drop-shadow-lg tabular-nums">{build}<span className="text-xl text-[#e8d5a8]">%</span></span>
          </div>

          {/* stages + controls */}
          <div className="reveal glass flex flex-col rounded-[28px] p-6" style={{ boxShadow: 'var(--card-shadow)' }}>
            <ol className="flex-1 space-y-2">
              {t.stages.map(([s, d], i) => {
                const on = build >= THRESHOLDS[i]
                return (
                  <li key={s} className="flex gap-3 rounded-2xl p-3 transition-all duration-500" style={{ background: on ? 'var(--glass-2)' : 'transparent', border: `1px solid ${on ? 'rgba(201,168,106,.5)' : 'var(--line)'}`, opacity: on ? 1 : 0.5 }}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold" style={{ background: on ? 'var(--maroon)' : 'var(--glass-2)', color: on ? '#fff' : 'var(--muted)' }}>{on ? '✓' : i + 1}</span>
                    <span><span className="block text-sm font-bold">{s}</span><span className="mt-0.5 block text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{d}</span></span>
                  </li>
                )
              })}
            </ol>
            <label className="mt-6 block">
              <span className="text-[10px] font-semibold tracking-[.22em] uppercase" style={{ color: 'var(--faint)' }}>{t.build}</span>
              <input type="range" min={0} max={100} value={build} className="mt-3 w-full"
                onChange={(e) => { touched.current = true; cancelAnimationFrame(animRef.current); setBuild(+e.target.value) }} />
            </label>
            <button onClick={() => { touched.current = false; play() }} className="btn-gold mt-4 rounded-full px-5 py-3 text-sm">{t.replay}</button>
          </div>
        </div>

        {/* structures */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {t.setup_cards.map(([title, body, badge]) => (
            <article key={title} className="reveal glass card-hover relative rounded-3xl p-6" style={{ boxShadow: 'var(--card-shadow)' }}>
              <span className="absolute top-5 end-5 rounded-full px-2.5 py-1 text-[10px] font-bold text-white" style={{ background: 'var(--maroon)' }}>{badge}</span>
              <h3 className="font-display pe-20 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{body}</p>
            </article>
          ))}
        </div>
        <p className="reveal mt-4 text-[11px]" style={{ color: 'var(--faint)' }}>⚖ {t.setup_note}</p>
      </div>
    </section>
  )
}
