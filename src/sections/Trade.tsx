import { useMemo, useRef, useState } from 'react'
import { dict, type Lang } from '../i18n'

const ORIGINS = [
  { id: 'beijing', en: 'Beijing · 北京', sea: [26, 34], air: [5, 8], seaRate: 420 },
  { id: 'shanghai', en: 'Shanghai · 上海', sea: [22, 30], air: [4, 7], seaRate: 390 },
  { id: 'guangzhou', en: 'Guangzhou · 广州', sea: [20, 28], air: [4, 6], seaRate: 365 },
  { id: 'shenzhen', en: 'Shenzhen · 深圳', sea: [20, 27], air: [4, 6], seaRate: 365 },
  { id: 'yiwu', en: 'Yiwu · 义乌', sea: [24, 32], air: [5, 8], seaRate: 405 },
] as const
const ICONS = ['⌖', '◉', '▦', '⬢']

export default function Trade({ lang }: { lang: Lang }) {
  const t = dict[lang]
  // --- Beijing ↔ Doha compare slider ---
  const [split, setSplit] = useState(50)
  const boxRef = useRef<HTMLDivElement>(null)
  const setFromPointer = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect(); if (!r) return
    const pct = ((clientX - r.left) / r.width) * 100
    setSplit(Math.min(92, Math.max(8, dict[lang].dir === 'rtl' ? 100 - pct : pct)))
  }
  // --- planner ---
  const [mode, setMode] = useState<'sea' | 'air'>('sea')
  const [originId, setOriginId] = useState('guangzhou')
  const [cbm, setCbm] = useState(12)
  const [kg, setKg] = useState(1800)
  const origin = ORIGINS.find((o) => o.id === originId)!
  const calc = useMemo(() => {
    const chargeable = Math.max(kg, Math.round(cbm * 167))
    const base = mode === 'sea' ? Math.max(cbm, 1) * origin.seaRate + 650 : chargeable * 4.9 + 380
    const lo = Math.round((base * 0.85) / 10) * 10, hi = Math.round((base * 1.2) / 10) * 10
    const transit = mode === 'sea' ? origin.sea : origin.air
    const equip = mode === 'air' ? 'ULD / palletised air freight' : cbm <= 10 ? t.container_lcl : cbm <= 28 ? t.container_20 : cbm <= 58 ? t.container_40 : t.container_40hq
    const fill = mode === 'sea' ? Math.min(100, (cbm / 68) * 100) : Math.min(100, (chargeable / 5000) * 100)
    return { chargeable, lo, hi, transit, equip, fill }
  }, [mode, origin, cbm, kg, t])

  return (
    <section id="trade" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="reveal max-w-3xl">
        <p className="kicker">{t.trade_kicker}</p>
        <h2 className="font-display mt-4 text-4xl leading-[1.04] font-bold sm:text-6xl">{t.trade_title}</h2>
        <p className="mt-5 leading-relaxed" style={{ color: 'var(--muted)' }}>{t.trade_sub}</p>
      </div>

      {/* ---- Real-photography comparison: Beijing CBD ↔ Doha West Bay ---- */}
      <figure className="reveal mt-10">
        <div ref={boxRef} className="group relative h-[460px] cursor-ew-resize touch-none overflow-hidden rounded-[2rem] bg-[#070308] select-none sm:h-[600px] lg:h-[640px]"
          style={{ boxShadow: '0 34px 90px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.08)', border: '1px solid rgba(232,213,168,.22)' }}
          onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); setFromPointer(e.clientX) }}
          onPointerMove={(e) => { if (e.buttons === 1) setFromPointer(e.clientX) }}
          role="slider" aria-label="Compare Beijing and Doha" aria-valuenow={Math.round(split)} aria-valuemin={8} aria-valuemax={92} tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'ArrowLeft') setSplit((s) => Math.max(8, s - 4)); if (e.key === 'ArrowRight') setSplit((s) => Math.min(92, s + 4)) }}>

          {/* Destination layer — real Doha West Bay photography */}
          <img src="/assets/doha-west-bay-real.jpg" alt="Doha West Bay skyline at night across Doha Bay, Qatar" loading="lazy" decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[50%_46%] transition duration-[1400ms] ease-out group-hover:scale-[1.025]" draggable={false} />

          {/* Origin layer — real Beijing CBD photography, clipped by the split */}
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: dict[lang].dir === 'rtl' ? `inset(0 0 0 ${100 - split}%)` : `inset(0 ${100 - split}% 0 0)` }}>
            <img src="/assets/beijing-cbd-real.jpg" alt="Beijing Central Business District with CCTV Headquarters and China Zun, China" loading="lazy" decoding="async"
              className="absolute inset-0 h-full w-full max-w-none object-cover object-[50%_8%] transition duration-[1400ms] ease-out group-hover:scale-[1.025]" draggable={false} />
          </div>

          {/* Cinematic dark-luxury treatment */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,2,6,.42) 0%, transparent 30%, transparent 58%, rgba(5,2,6,.78) 100%)' }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70 transition duration-1000 group-hover:opacity-45" style={{ background: 'linear-gradient(115deg, rgba(138,21,56,.16), transparent 46%, rgba(201,168,106,.10))' }} />

          <span className="absolute top-5 left-1/2 z-20 -translate-x-1/2 rounded-full px-4 py-2 text-[10px] font-bold tracking-[.18em] whitespace-nowrap text-white uppercase shadow-xl"
            style={{ background: 'rgba(6,3,7,.58)', border: '1px solid rgba(232,213,168,.28)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
            {t.compare_hint}
          </span>

          {/* City captions follow the visible territory of each photograph */}
          <div className="absolute bottom-6 start-6 z-20 max-w-[78%] text-white transition-opacity duration-300 sm:bottom-8 sm:start-8" style={{ opacity: split > 17 ? 1 : 0 }}>
            <span className="block text-[10px] font-bold tracking-[.28em] text-[#e8d5a8] uppercase">39.90°N · 116.40°E</span>
            <span className="font-display mt-2 block text-2xl leading-none font-bold tracking-wide sm:text-4xl" style={{ textShadow: '0 4px 24px rgba(0,0,0,.75)' }}>{t.compare_left}</span>
            <span className="mt-2 block text-xs text-white/78 sm:text-sm">{t.photo_beijing_sub}</span>
          </div>
          <div className="absolute end-6 bottom-6 z-20 max-w-[78%] text-end text-white transition-opacity duration-300 sm:end-8 sm:bottom-8" style={{ opacity: split < 83 ? 1 : 0 }}>
            <span className="block text-[10px] font-bold tracking-[.28em] text-[#e8d5a8] uppercase">25.29°N · 51.53°E</span>
            <span className="font-display mt-2 block text-2xl leading-none font-bold tracking-wide sm:text-4xl" style={{ textShadow: '0 4px 24px rgba(0,0,0,.75)' }}>{t.compare_right}</span>
            <span className="mt-2 block text-xs text-white/78 sm:text-sm">{t.photo_doha_sub}</span>
          </div>

          {/* Precision split handle */}
          <div aria-hidden="true" className="absolute inset-y-0 z-30" style={{ insetInlineStart: `calc(${split}% - 1px)` }}>
            <div className="h-full w-[2px] shadow-[0_0_18px_rgba(232,213,168,.55)]" style={{ background: 'linear-gradient(180deg, transparent, #e8d5a8 18%, #fff8e6 50%, #e8d5a8 82%, transparent)' }} />
            <div className="absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xl text-[#e8d5a8] shadow-2xl transition duration-500 group-hover:scale-110"
              style={{ background: 'rgba(6,3,7,.66)', border: '1px solid rgba(232,213,168,.75)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>↔</div>
          </div>
        </div>
        <figcaption className="mt-3 flex flex-wrap gap-x-2 gap-y-1 px-1 text-[10px] leading-relaxed" style={{ color: 'var(--faint)' }}>
          <span>{t.photo_credit_label}:</span>
          <a className="underline decoration-[#c9a86a]/50 underline-offset-2 transition hover:text-[#e8d5a8]" href="https://commons.wikimedia.org/wiki/File:Beijing_Central_Business_District_(20240826163226).jpg" target="_blank" rel="noreferrer">HoweyYuan — Beijing CBD</a>
          <span aria-hidden="true">·</span>
          <a className="underline decoration-[#c9a86a]/50 underline-offset-2 transition hover:text-[#e8d5a8]" href="https://commons.wikimedia.org/wiki/File:Doha_West_Bay_Skyline_Qatar_Jan_2020.jpg" target="_blank" rel="noreferrer">Thameur Belghith — Doha West Bay</a>
          <span aria-hidden="true">·</span>
          <a className="underline decoration-[#c9a86a]/50 underline-offset-2 transition hover:text-[#e8d5a8]" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
          <span>via Wikimedia Commons; cropped &amp; colour-graded.</span>
        </figcaption>
      </figure>

      {/* ---- services ---- */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.services.map(([title, body], i) => (
          <article key={title} className="reveal glass card-hover rounded-3xl p-6" style={{ boxShadow: 'var(--card-shadow)' }}>
            <div className="flex items-center justify-between"><span className="text-3xl">{ICONS[i]}</span><span className="font-display big-outline text-4xl font-bold">0{i + 1}</span></div>
            <h3 className="font-display mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{body}</p>
          </article>
        ))}
      </div>

      {/* ---- steps ---- */}
      <div className="reveal mt-20">
        <p className="kicker">{t.steps_kicker}</p>
        <h3 className="font-display mt-3 text-3xl font-bold sm:text-4xl">{t.steps_title}</h3>
        <div className="relative mt-8 grid gap-3 sm:grid-cols-5">
          <div className="absolute top-5 inset-x-4 hidden h-px sm:block" style={{ background: 'linear-gradient(90deg, var(--maroon), var(--gold))' }} />
          {t.steps.map(([s, d], i) => (
            <div key={s} className="relative rounded-2xl p-4 pt-0 sm:text-center">
              <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white sm:mx-auto" style={{ background: i === 4 ? 'var(--gold)' : 'var(--maroon)', color: i === 4 ? '#2b0712' : '#fff', border: '2px solid var(--bg)' }}>{i + 1}</span>
              <div className="font-display mt-3 font-bold">{s}</div>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- planner ---- */}
      <div id="planner" className="reveal glass mt-16 scroll-mt-28 rounded-[28px] p-6 sm:p-10" style={{ boxShadow: 'var(--card-shadow)' }}>
        <p className="kicker">{t.calc_kicker}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-3xl font-bold sm:text-4xl">{t.calc_title}</h3>
          <div className="glass flex rounded-full p-1 text-sm font-semibold">
            {(['sea', 'air'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className="rounded-full px-5 py-2 transition"
                style={mode === m ? { background: 'var(--maroon)', color: '#fff' } : { color: 'var(--muted)' }}>{m === 'sea' ? t.sea : t.air}</button>
            ))}
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm" style={{ color: 'var(--muted)' }}>{t.calc_sub}</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-7">
            <label className="block"><span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--faint)' }}>{t.origin}</span>
              <select value={originId} onChange={(e) => setOriginId(e.target.value)} className="glass mt-2 w-full rounded-xl px-4 py-3 text-sm" style={{ color: 'var(--text)', background: 'var(--bg-2)' }}>
                {ORIGINS.map((o) => <option key={o.id} value={o.id}>{o.en} → Doha الدوحة</option>)}
              </select></label>
            <label className="block"><span className="flex justify-between text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--faint)' }}><span>{t.cbm}</span><span className="font-display text-base" style={{ color: 'var(--gold)' }}>{cbm} CBM</span></span>
              <input type="range" min={1} max={80} value={cbm} onChange={(e) => setCbm(+e.target.value)} className="mt-3 w-full" /></label>
            <label className="block"><span className="flex justify-between text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--faint)' }}><span>{t.weight}</span><span className="font-display text-base" style={{ color: 'var(--gold)' }}>{kg.toLocaleString()} kg</span></span>
              <input type="range" min={50} max={24000} step={50} value={kg} onChange={(e) => setKg(+e.target.value)} className="mt-3 w-full" /></label>
            <div>
              <div className="mb-2 flex gap-1" aria-hidden>
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="h-9 flex-1 rounded-[4px] transition-all duration-500" style={{ background: (i / 14) * 100 < calc.fill ? 'linear-gradient(180deg,#b4234a,#8a1538)' : 'var(--glass-2)', border: '1px solid var(--line)' }} />
                ))}
              </div>
              <p className="text-[11px]" style={{ color: 'var(--faint)' }}>{mode === 'sea' ? '▦ Container / consolidation fill' : '▦ Chargeable load'} · {Math.round(calc.fill)}%</p>
            </div>
          </div>
          <div className="grid content-start gap-3 sm:grid-cols-2">
            {[
              [t.transit, `${calc.transit[0]}–${calc.transit[1]} ${t.days}`],
              [t.indicative, `$${calc.lo.toLocaleString()} – $${calc.hi.toLocaleString()}`],
              [t.equipment, calc.equip],
              [t.chargeable, `${calc.chargeable.toLocaleString()} kg`],
            ].map(([l, v]) => (
              <div key={l} className="rounded-2xl p-5" style={{ background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
                <div className="text-[10px] font-semibold tracking-[.2em] uppercase" style={{ color: 'var(--faint)' }}>{l}</div>
                <div className="font-display mt-2 text-xl leading-tight font-bold">{v}</div>
              </div>
            ))}
            <a href="#quote" className="btn-maroon rounded-2xl px-5 py-4 text-center text-sm sm:col-span-2">{t.get_quote} →</a>
            <p className="text-[11px] leading-relaxed sm:col-span-2" style={{ color: 'var(--faint)' }}>⚠ {t.calc_note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
